import type {
  B2BCalculationResult,
  UoPCalculationResult,
} from "../../lib/taxCalculations"
import type { Translation } from "../../i18n/translations"
import { fmt, fromPLN, toPLN } from "../../lib/formatting"
import type { Currency, InputType, SalaryInputPeriod } from "../../types"
import { Button } from "../ui/Button"
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
  onCompare: () => void
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
      <section
        className="flex flex-col gap-4 py-1 tablet:flex-row tablet:items-center tablet:justify-between"
        aria-label={props.t.compareOffers}
      >
        <div>
          <h3 className="font-display text-xl font-semibold text-text-primary">
            {props.t.compareOffers}
          </h3>
          <p className="mt-1 text-xs leading-5 text-text-secondary tablet:text-sm">
            {props.t.compareDescription}
          </p>
        </div>
        <Button
          variant="dark"
          onClick={props.onCompare}
          trailingIcon={<span aria-hidden="true">→</span>}
          className="w-full shrink-0 rounded-[12px] tablet:w-auto tablet:min-w-[178px]"
        >
          {props.t.compareOffers}
        </Button>
      </section>
    </section>
  )
}
