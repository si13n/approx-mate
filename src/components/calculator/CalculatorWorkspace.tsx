import type { TaxProfile } from "../../config/tax"
import type { Translation } from "../../i18n/translations"
import type { Currency, InputType, SalaryInputPeriod } from "../../types"
import { DecisionResults, type Results } from "./DecisionResults"
import { TargetPanel, type QuickScenario } from "./TargetPanel"

interface CalculatorWorkspaceProps {
  rawAmount: string
  amount: number
  currency: Currency
  inputType: InputType
  period: SalaryInputPeriod
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
  onPeriodChange: (period: SalaryInputPeriod) => void
  onQuickScenario: (scenario: QuickScenario) => void
  onEditProfile: () => void
  onCompare: () => void
  onCopy: () => void
}

export function CalculatorWorkspace(props: CalculatorWorkspaceProps) {
  return (
    <main className="grid min-w-0 gap-10 pt-3 desktop:grid-cols-[336px_minmax(0,848px)] desktop:gap-16 desktop:pt-5">
      <div className="min-w-0 desktop:w-[336px]">
        <TargetPanel {...props} />
      </div>
      <div className="min-w-0 desktop:w-[848px]">
        <DecisionResults
          results={props.results}
          amount={props.amount}
          currency={props.currency}
          inputType={props.inputType}
          period={props.period}
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
  )
}
