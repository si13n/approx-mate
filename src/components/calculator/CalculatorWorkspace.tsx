import type { TaxProfile } from "../../config/tax"
import { JobXRayPanel } from "../../features/job-xray/components/JobXRayPanel"
import { OfferAnalysisPanel } from "../../features/job-xray/components/OfferAnalysisPanel"
import { WorkspaceTabs } from "../../features/job-xray/components/WorkspaceTabs"
import type { AnalyzedOffer, JobAnalysis } from "../../features/job-xray/types"
import type { Translation } from "../../i18n/translations"
import type { Currency, InputType } from "../../types"
import { DecisionResults } from "./DecisionResults"
import { TargetPanel, type QuickScenario } from "./TargetPanel"

interface CalculatorWorkspaceProps {
  rawAmount: string
  amount: number
  currency: Currency
  inputType: InputType
  sliderValue: number
  profile: TaxProfile
  quickScenarios: QuickScenario[]
  t: Translation
  rates: Record<string, number>
  results: {
    b2bGrossPLN: number
    b2bNetPLN: number
    uopGrossPLN: number
    uopNetPLN: number
  }
  hoursPerMonth: number
  recruiterMessage: string
  copied: boolean
  offers: AnalyzedOffer[]
  activeTab: string
  onAmountChange: (value: string) => void
  onSliderChange: (value: number) => void
  onCurrencyChange: (currency: Currency) => void
  onInputTypeChange: (type: InputType) => void
  onQuickScenario: (scenario: QuickScenario) => void
  onEditProfile: () => void
  onCompare: () => void
  onAnalyzeOffer: (analysis: JobAnalysis, originalInput: string) => void
  onSelectTab: (id: string) => void
  onCloseOffer: (id: string) => void
  onCompareOffer: () => void
  onCopy: () => void
}

export function CalculatorWorkspace(props: CalculatorWorkspaceProps) {
  return (
    <>
      <section className="mt-1" aria-labelledby="hero-title">
        <h1
          id="hero-title"
          className="max-w-3xl font-display text-[29px] font-bold leading-tight tablet:text-[38px]"
        >
          {props.t.heroTitle}
        </h1>
        <p className="mt-1.5 text-[13px] text-content-secondary tablet:hidden">
          {props.t.heroDescriptionMobile}
        </p>
        <p className="mt-1.5 hidden text-base text-content-secondary tablet:block">
          {props.t.heroDescription}
        </p>
      </section>
      <main className="grid min-w-0 gap-3 desktop:grid-cols-[416px_minmax(0,1fr)] desktop:gap-5">
        <div className="flex min-w-0 flex-col gap-3">
          <JobXRayPanel
            t={props.t}
            offerCount={props.offers.length}
            onAnalyze={props.onAnalyzeOffer}
          />
          <TargetPanel {...props} />
        </div>
        <div className="min-w-0">
          <WorkspaceTabs
            offers={props.offers.map((offer, index) => ({
              id: offer.id,
              label: `${props.t.offerLabel} ${index + 1}`,
              title: offer.analysis.title.value ?? undefined,
            }))}
            activeTab={props.activeTab}
            t={props.t}
            onSelect={props.onSelectTab}
            onClose={props.onCloseOffer}
          />
          {props.activeTab === "calculator" ? (
            <div
              id="workspace-panel-calculator"
              role="tabpanel"
              aria-labelledby="workspace-tab-calculator"
            >
              <DecisionResults
                results={props.results}
                amount={props.amount}
                currency={props.currency}
                inputType={props.inputType}
                rates={props.rates}
                hoursPerMonth={props.hoursPerMonth}
                recruiterMessage={props.recruiterMessage}
                copied={props.copied}
                t={props.t}
                onCompare={props.onCompare}
                onCopy={props.onCopy}
              />
            </div>
          ) : (
            props.offers
              .filter((offer) => offer.id === props.activeTab)
              .map((offer) => (
                <OfferAnalysisPanel
                  key={offer.id}
                  analysis={offer.analysis}
                  sourceText={offer.sourceText}
                  t={props.t}
                  onCompare={props.onCompareOffer}
                />
              ))
          )}
        </div>
      </main>
    </>
  )
}
