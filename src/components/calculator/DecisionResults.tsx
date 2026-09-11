import type {
  B2BCalculationResult,
  UoPCalculationResult,
} from "../../lib/taxCalculations"
import type { Translation } from "../../i18n/translations"
import { fmt, fromPLN, toPLN } from "../../lib/formatting"
import type { Currency, InputType, SalaryInputPeriod } from "../../types"
import { OfferResultCard } from "./OfferResultCard"
import { RecruiterMessage } from "./RecruiterMessage"

export interface Results {
  b2b: B2BCalculationResult
  uop: UoPCalculationResult
}
interface DecisionResultsProps {
  results: Results
  amount: number
  currency: Currency
  inputType: InputType
  period: SalaryInputPeriod
  rates: Record<string, number>
  hoursPerMonth: number
  recruiterMessage: string
  copied: boolean
  t: Translation
  onCopy: () => void
}

export function DecisionResults(props: DecisionResultsProps) {
  const target = fmt(props.amount, props.currency)
  const targetPLN = toPLN(props.amount, props.currency, props.rates)
  const targetConversions = (["PLN", "USD", "EUR"] as Currency[])
    .filter((currency) => currency !== props.currency)
    .map((currency) => fmt(fromPLN(targetPLN, currency, props.rates), currency))
    .join(" · ")
  const decisionLabel =
    props.inputType === "net" ? props.t.toTakeHome : props.t.offeredGross
  return (
    <section
      className="flex min-w-0 flex-col gap-5"
      aria-labelledby="decision-title"
    >
      <div>
        <h2
          id="decision-title"
          className="font-display text-[26px] font-bold leading-[1.12] text-text-primary desktop:text-[28px]"
        >
          {decisionLabel} {target} / {props.t.salaryPeriod[props.period]}
        </h2>
        <p className="mt-2 text-sm text-text-secondary desktop:text-base">
          {targetConversions}
        </p>
      </div>
      <div className="grid gap-5 desktop:grid-cols-2">
        <OfferResultCard
          contract="B2B"
          calculation={props.results.b2b}
          inputType={props.inputType}
          period={props.period}
          rates={props.rates}
          hoursPerMonth={props.hoursPerMonth}
          t={props.t}
        />
        <OfferResultCard
          contract="UoP"
          calculation={props.results.uop}
          inputType={props.inputType}
          period={props.period}
          rates={props.rates}
          hoursPerMonth={props.hoursPerMonth}
          t={props.t}
        />
      </div>
      <div>
        <RecruiterMessage
          message={props.recruiterMessage}
          copied={props.copied}
          onCopy={props.onCopy}
          t={props.t}
        />
      </div>
    </section>
  )
}
