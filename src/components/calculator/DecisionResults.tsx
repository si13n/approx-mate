import type { Translation } from "../../i18n/translations"
import { fmt } from "../../lib/formatting"
import type { Currency, InputType } from "../../types"
import { Button } from "../ui/Button"
import { OfferResultCard } from "./OfferResultCard"
import { RecruiterMessage } from "./RecruiterMessage"

interface Results {
  b2bGrossPLN: number
  b2bNetPLN: number
  uopGrossPLN: number
  uopNetPLN: number
}
interface DecisionResultsProps {
  results: Results
  amount: number
  currency: Currency
  inputType: InputType
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
  const decisionLabel =
    props.inputType === "net" ? props.t.toTakeHome : props.t.offeredGross
  return (
    <section
      className="flex min-w-0 flex-col gap-3 rounded-panel border border-border bg-surface p-4 desktop:p-6"
      aria-labelledby="decision-title"
    >
      <div>
        <p className="text-xs font-semibold text-content-secondary desktop:normal-case">
          {props.t.yourDecision}
        </p>
        <h2
          id="decision-title"
          className="mt-1 font-display text-xl font-bold tablet:text-[27px]"
        >
          {decisionLabel} {target} {props.t.perMonth}
        </h2>
      </div>
      <div className="grid gap-2 tablet:grid-cols-2 tablet:gap-3">
        <OfferResultCard
          contract="B2B"
          grossPLN={props.results.b2bGrossPLN}
          netPLN={props.results.b2bNetPLN}
          currency={props.currency}
          inputType={props.inputType}
          rates={props.rates}
          hoursPerMonth={props.hoursPerMonth}
          t={props.t}
        />
        <OfferResultCard
          contract="UoP"
          grossPLN={props.results.uopGrossPLN}
          netPLN={props.results.uopNetPLN}
          currency={props.currency}
          inputType={props.inputType}
          rates={props.rates}
          hoursPerMonth={props.hoursPerMonth}
          t={props.t}
        />
      </div>
      <div className="order-4 tablet:order-3">
        <RecruiterMessage
          message={props.recruiterMessage}
          copied={props.copied}
          onCopy={props.onCopy}
          t={props.t}
        />
      </div>
      <section
        className="order-3 flex min-h-12 items-center justify-between rounded-card bg-inverse px-3.5 py-3 text-content-inverse tablet:order-4 tablet:min-h-[104px] tablet:p-4"
        aria-label={props.t.compareOffers}
      >
        <div>
          <h3 className="font-display text-sm font-semibold tablet:text-2xl">
            {props.t.compareOffers}
          </h3>
          <p className="hidden text-xs text-border-strong tablet:block">
            {props.t.compareDescription}
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={props.onCompare}
          trailingIcon={<span aria-hidden="true">→</span>}
          className="border-0"
        >
          {props.t.compareOffers}
        </Button>
      </section>
    </section>
  )
}
