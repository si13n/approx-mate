import { useEffect, useMemo, useRef, useState } from "react"
import { AppShell } from "./components/AppShell"
import { Footer } from "./components/Footer"
import { Header } from "./components/Header"
import { TrustStrip } from "./components/TrustStrip"
import { CalculatorWorkspace } from "./components/calculator/CalculatorWorkspace"
import type { QuickScenario } from "./components/calculator/TargetPanel"
import { ComparisonPage } from "./components/comparison/ComparisonPage"
import { TaxProfileModal } from "./components/tax-profile/TaxProfileModal"
import {
  createAnalysisComparisonOffers,
  createCalculatorComparisonOffers,
} from "./features/job-xray/comparisonPrefill"
import type { AnalyzedOffer, JobAnalysis } from "./features/job-xray/types"
import { translations } from "./i18n/translations"
import {
  trackCalculatorUsed,
  trackCurrencyChanged,
  trackLanguageChanged,
  trackModeChanged,
  trackPageView,
  trackQuickScenarioClick,
  trackRecruiterMessageCopy,
  trackOfferTabClosed,
  trackOfferTabOpened,
  trackOfferCompareClicked,
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
import type { Offer } from "./components/comparison/compareCalculations"

export default function App() {
  const [lang, setLang] = useState<Lang>("en")
  const [inputType, setInputType] = useState<InputType>("net")
  const [rawAmount, setRawAmount] = useState("5000")
  const [currency, setCurrency] = useState<Currency>("USD")
  const [sliderValue, setSliderValue] = useState(5000)
  const [copied, setCopied] = useState(false)
  const [taxProfileOpen, setTaxProfileOpen] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [activeTab, setActiveTab] = useState("calculator")
  const [analyzedOffers, setAnalyzedOffers] = useState<AnalyzedOffer[]>([])
  const [comparisonOffers, setComparisonOffers] = useState<Offer[]>()
  const offerSequence = useRef(0)
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

  const target = { amount, currency, inputType }

  const addAnalyzedOffer = (analysis: JobAnalysis, originalInput: string) => {
    offerSequence.current += 1
    const id = `offer-${offerSequence.current}`
    const normalizedAnalysis = { ...analysis, id }
    setAnalyzedOffers((current) => [
      ...current,
      {
        id,
        analysis: normalizedAnalysis,
        sourceText: analysis.source.kind === "text" ? originalInput : null,
      },
    ])
    setActiveTab(id)
    trackOfferTabOpened()
  }

  const closeAnalyzedOffer = (id: string) => {
    setAnalyzedOffers((current) => current.filter((offer) => offer.id !== id))
    if (activeTab === id) setActiveTab("calculator")
    trackOfferTabClosed()
  }

  const openCalculatorComparison = () => {
    setComparisonOffers(createCalculatorComparisonOffers(target))
    setShowComparison(true)
  }

  const openOfferComparison = () => {
    setComparisonOffers(createAnalysisComparisonOffers(analyzedOffers, target))
    setShowComparison(true)
    trackOfferCompareClicked()
  }

  return (
    <div className="min-h-screen bg-page text-content">
      <div data-dialog-background>
        <AppShell>
          <Header
            lang={lang}
            t={t}
            onHome={() => {
              setShowComparison(false)
              setActiveTab("calculator")
              window.scrollTo({ top: 0, behavior: "instant" })
            }}
            onLanguageChange={(nextLang) => {
              setLang(nextLang)
              trackLanguageChanged(nextLang)
            }}
          />

          {showComparison ? (
            <ComparisonPage
              onBack={() => setShowComparison(false)}
              rates={rates}
              profile={profile}
              t={t}
              initialOffers={comparisonOffers}
            />
          ) : results ? (
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
              offers={analyzedOffers}
              activeTab={activeTab}
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
              onCompare={openCalculatorComparison}
              onAnalyzeOffer={addAnalyzedOffer}
              onSelectTab={setActiveTab}
              onCloseOffer={closeAnalyzedOffer}
              onCompareOffer={openOfferComparison}
              onCopy={() => {
                void copyRecruiterMessage()
              }}
            />
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

          <TrustStrip
            t={t}
            rateLabel={formatRateDate(
              effectiveDate,
              lang === "pl" ? "pl-PL" : lang === "ua" ? "uk-UA" : "en-US",
            )}
            isFallback={isFallback}
          />
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
