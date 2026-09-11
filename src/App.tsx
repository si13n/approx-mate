import { useEffect, useMemo, useState } from "react"
import { AppShell } from "./components/AppShell"
import { Footer } from "./components/Footer"
import { Header } from "./components/Header"
import { JobOfferInputBar } from "./components/JobOfferInputBar"
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
import { formatRateDate, useExchangeRates } from "./lib/exchangeRates"
import { fmt, toPLN } from "./lib/formatting"
import {
  calculateB2BFromGross,
  calculateB2BFromNet,
  calculateUoPFromGross,
  calculateUoPFromNet,
} from "./lib/taxCalculations"
import { useTaxProfile } from "./lib/useTaxProfile"
import type { Currency, InputType, Lang } from "./types"

export default function App() {
  const [lang, setLang] = useState<Lang>("en")
  const [inputType, setInputType] = useState<InputType>("net")
  const [rawAmount, setRawAmount] = useState("5000")
  const [currency, setCurrency] = useState<Currency>("USD")
  const [sliderValue, setSliderValue] = useState(5000)
  const [copied, setCopied] = useState(false)
  const [taxProfileOpen, setTaxProfileOpen] = useState(false)
  const { rates, effectiveDate, isFallback } = useExchangeRates()
  const { profile, updateProfile, isLoaded } = useTaxProfile()
  const t = translations[lang]
  const amount = Number.parseFloat(rawAmount) || 0
  const hoursPerMonth = 160
  const quickScenarios = useMemo<QuickScenario[]>(
    () => [
      {
        label: `$3k ${t.netLabel.toLowerCase()}`,
        amount: 3000,
        currency: "USD",
        type: "net",
      },
      {
        label: `$4k ${t.netLabel.toLowerCase()}`,
        amount: 4000,
        currency: "USD",
        type: "net",
      },
      {
        label: `$5k ${t.netLabel.toLowerCase()}`,
        amount: 5000,
        currency: "USD",
        type: "net",
      },
      {
        label: `€3.5k ${t.netLabel.toLowerCase()}`,
        amount: 3500,
        currency: "EUR",
        type: "net",
      },
      {
        label: `€5k ${t.netLabel.toLowerCase()}`,
        amount: 5000,
        currency: "EUR",
        type: "net",
      },
      {
        label: `10k PLN ${t.netLabel.toLowerCase()}`,
        amount: 10000,
        currency: "PLN",
        type: "net",
      },
      {
        label: `15k PLN ${t.grossLabel.toLowerCase()}`,
        amount: 15000,
        currency: "PLN",
        type: "gross",
      },
      {
        label: `20k PLN ${t.grossLabel.toLowerCase()}`,
        amount: 20000,
        currency: "PLN",
        type: "gross",
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
    const monthlyPLN = amount > 0 ? toPLN(amount, currency, rates) : 0
    const b2b =
      inputType === "gross" || monthlyPLN === 0
        ? calculateB2BFromGross(monthlyPLN, profile)
        : calculateB2BFromNet(monthlyPLN, profile)
    const uop =
      inputType === "gross" || monthlyPLN === 0
        ? calculateUoPFromGross(monthlyPLN, profile)
        : calculateUoPFromNet(monthlyPLN, profile)

    return { b2b, uop }
  }, [amount, currency, inputType, isLoaded, profile, rates])

  const recruiterMessage = useMemo(() => {
    const type =
      inputType === "net"
        ? t.desiredNet.toLowerCase()
        : t.offeredGross.toLowerCase()
    return t.recruiterMessage(fmt(amount, currency), type)
  }, [amount, currency, inputType, t])

  const openTaxProfile = () => {
    setTaxProfileOpen(true)
    trackTaxProfileOpen()
  }

  const applyScenario = (scenario: QuickScenario) => {
    setRawAmount(String(scenario.amount))
    setSliderValue(scenario.amount)
    setCurrency(scenario.currency)
    setInputType(scenario.type)
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
    <div className="min-h-screen bg-page text-content">
      <div data-dialog-background>
        <AppShell>
          <Header
            lang={lang}
            t={t}
            activePage="calculator"
            onHome={() => {
              window.scrollTo({ top: 0, behavior: "instant" })
            }}
            onLanguageChange={(nextLang) => {
              setLang(nextLang)
              trackLanguageChanged(nextLang)
            }}
          />

          {results ? (
            <>
              <CalculatorWorkspace
                rawAmount={rawAmount}
                amount={amount}
                currency={currency}
                inputType={inputType}
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
                onQuickScenario={applyScenario}
                onEditProfile={openTaxProfile}
                onCompare={() => {
                  window.location.href = "/compare"
                }}
                onCopy={() => {
                  void copyRecruiterMessage()
                }}
              />
              <JobOfferInputBar t={t} />
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

          <Footer t={t} />
        </AppShell>
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
