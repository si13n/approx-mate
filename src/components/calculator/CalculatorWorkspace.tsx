import type { TaxProfile } from "../../config/tax"
import type { Translation } from "../../i18n/translations"
import type { Currency, InputType } from "../../types"
import { DecisionResults, type Results } from "./DecisionResults"
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
  results: Results
  hoursPerMonth: number
  recruiterMessage: string
  copied: boolean
  onAmountChange: (value: string) => void
  onSliderChange: (value: number) => void
  onCurrencyChange: (currency: Currency) => void
  onInputTypeChange: (type: InputType) => void
  onQuickScenario: (scenario: QuickScenario) => void
  onEditProfile: () => void
  onCompare: () => void
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
      <main className="flex gap-16 min-w-0">
        <div className="w-[336px] flex-shrink-0">
          <TargetPanel {...props} />
        </div>
        <div className="w-[848px] flex-shrink-0">
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
      </main>
    </>
  )
}
