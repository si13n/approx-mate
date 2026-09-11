import { useEffect, useMemo, useState } from "react"
import { AppShell } from "./components/AppShell"
import { Footer } from "./components/Footer"
import { Header } from "./components/Header"
import { JobOfferInputBar } from "./components/JobOfferInputBar"
import { PageDecorations } from "./components/PageDecorations"
import { CalculatorWorkspace } from "./components/calculator/CalculatorWorkspace"
import type { QuickScenario } from "./components/calculator/TargetPanel"
import { TaxProfileModal } from "./components/tax-profile/TaxProfileModal"
import { translations } from "./i18n/translations"
import {
  trackCalculatorUsed,
  trackCurrencyChanged,
  trackLanguageChanged,
  trackModeChanged,
  trackPageView,
  trackQuickScenarioClick,
  trackRecruiterMessageCopy,
  trackTaxProfileOpen,
} from "./lib/analytics"
import { useExchangeRates } from "./lib/exchangeRates"
import { fmt, toPLN } from "./lib/formatting"
import {
  convertSalaryPeriod,
  HOURS_PER_MONTH,
  toMonthlyAmount,
} from "./lib/salaryPeriod"
import {
  calculateB2BFromGross,
  calculateB2BFromNet,
  calculateUoPFromGross,
  calculateUoPFromNet,
} from "./lib/taxCalculations"
import { useTaxProfile } from "./lib/useTaxProfile"
import type { Currency, InputType, Lang, SalaryInputPeriod } from "./types"

export default function App() {
  const [lang, setLang] = useState<Lang>("en")
  const [inputType, setInputType] = useState<InputType>("net")
  const [rawAmount, setRawAmount] = useState("5000")
  const [currency, setCurrency] = useState<Currency>("USD")
  const [period, setPeriod] = useState<SalaryInputPeriod>("month")
  const [sliderValue, setSliderValue] = useState(5000)
  const [copied, setCopied] = useState(false)
  const [taxProfileOpen, setTaxProfileOpen] = useState(false)
  const { rates } = useExchangeRates()
  const { profile, updateProfile, isLoaded } = useTaxProfile()
  const t = translations[lang]
  const amount = Number.parseFloat(rawAmount) || 0
  const hoursPerMonth = HOURS_PER_MONTH
  const quickScenarios = useMemo<QuickScenario[]>(
    () => [
      {
        label: `$3k ${t.netLabel.toLowerCase()}`,
        amount: 3000,
        currency: "USD",
        type: "net",
        period: "month",
      },
      {
        label: `$5k ${t.netLabel.toLowerCase()}`,
        amount: 5000,
        currency: "USD",
        type: "net",
        period: "month",
      },
      {
        label: `20k PLN ${t.grossLabel.toLowerCase()}`,
        amount: 20000,
        currency: "PLN",
        type: "gross",
        period: "month",
      },
      {
        label: `15k PLN ${t.netLabel.toLowerCase()}`,
        amount: 15000,
        currency: "PLN",
        type: "net",
        period: "month",
      },
    ],
    [t],
  )

  useEffect(() => {
    trackPageView()
  }, [])
  useEffect(() => {
    if (amount > 0) trackCalculatorUsed()
  }, [amount])

  const results = useMemo(() => {
    if (!isLoaded) return null
    const monthlyAmount = toMonthlyAmount(amount, period)
    const monthlyPLN =
      monthlyAmount > 0 ? toPLN(monthlyAmount, currency, rates) : 0
    const b2b =
      inputType === "gross" || monthlyPLN === 0
        ? calculateB2BFromGross(monthlyPLN, profile)
        : calculateB2BFromNet(monthlyPLN, profile)
    const uop =
      inputType === "gross" || monthlyPLN === 0
        ? calculateUoPFromGross(monthlyPLN, profile)
        : calculateUoPFromNet(monthlyPLN, profile)

    return { b2b, uop }
  }, [amount, currency, inputType, isLoaded, period, profile, rates])

  const recruiterMessage = useMemo(() => {
    const type =
      inputType === "net"
        ? t.desiredNet.toLowerCase()
        : t.offeredGross.toLowerCase()
    return t.recruiterMessage(
      fmt(amount, currency),
      type,
      t.salaryPeriod[period],
    )
  }, [amount, currency, inputType, period, t])

  const openTaxProfile = () => {
    setTaxProfileOpen(true)
    trackTaxProfileOpen()
  }

  const applyScenario = (scenario: QuickScenario) => {
    setRawAmount(String(scenario.amount))
    setSliderValue(scenario.amount)
    setCurrency(scenario.currency)
    setInputType(scenario.type)
    setPeriod(scenario.period)
    trackQuickScenarioClick(scenario.label)
  }

  const copyRecruiterMessage = async () => {
    try {
      await navigator.clipboard.writeText(recruiterMessage)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
      trackRecruiterMessageCopy()
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-page text-content">
      <PageDecorations />
      <div className="relative z-10" data-dialog-background>
        <Header
          lang={lang}
          t={t}
          activePage="calculator"
          onHome={() => {
            window.location.href = "/"
          }}
          onLanguageChange={(nextLang) => {
            setLang(nextLang)
            trackLanguageChanged(nextLang)
          }}
        />
        <AppShell>
          {results ? (
            <>
              <CalculatorWorkspace
                rawAmount={rawAmount}
                amount={amount}
                currency={currency}
                inputType={inputType}
                period={period}
                sliderValue={sliderValue}
                profile={profile}
                quickScenarios={quickScenarios}
                t={t}
                rates={rates}
                results={results}
                hoursPerMonth={hoursPerMonth}
                recruiterMessage={recruiterMessage}
                copied={copied}
                onAmountChange={setRawAmount}
                onSliderChange={setSliderValue}
                onCurrencyChange={(nextCurrency) => {
                  setCurrency(nextCurrency)
                  trackCurrencyChanged(nextCurrency)
                }}
                onInputTypeChange={(nextInputType) => {
                  setInputType(nextInputType)
                  trackModeChanged(nextInputType)
                }}
                onPeriodChange={(nextPeriod) => {
                  const converted = convertSalaryPeriod(
                    amount,
                    period,
                    nextPeriod,
                  )
                  const rounded =
                    nextPeriod === "hour"
                      ? Math.round(converted * 100) / 100
                      : Math.round(converted)
                  setRawAmount(String(rounded))
                  setSliderValue(rounded)
                  setPeriod(nextPeriod)
                }}
                onQuickScenario={applyScenario}
                onEditProfile={openTaxProfile}
                onCompare={() => {
                  window.location.href = "/compare"
                }}
                onCopy={() => {
                  void copyRecruiterMessage()
                }}
              />
              <div className="mx-auto w-full max-w-[624px]">
                <JobOfferInputBar t={t} />
              </div>
            </>
          ) : (
            <main
              className="flex min-h-[60vh] items-center justify-center"
              role="status"
              aria-live="polite"
            >
              <span
                className="size-8 animate-spin rounded-full border-2 border-border border-t-primary"
                aria-hidden="true"
              />
              <span className="sr-only">{t.loadingCalculator}</span>
            </main>
          )}
        </AppShell>
        <Footer t={t} />
      </div>

      <TaxProfileModal
        open={taxProfileOpen}
        profile={profile}
        t={t}
        onClose={() => setTaxProfileOpen(false)}
        onSave={updateProfile}
      />
    </div>
  )
}
