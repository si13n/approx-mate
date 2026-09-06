import type { Translation } from "../../i18n/translations"
import { fmt, fromPLN, toPLN } from "../../lib/formatting"
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
  const targetPLN = toPLN(props.amount, props.currency, props.rates)
  const targetConversions = (["PLN", "USD", "EUR"] as Currency[])
    .filter((currency) => currency !== props.currency)
    .map((currency) => fmt(fromPLN(targetPLN, currency, props.rates), currency))
    .join(" · ")
  const decisionLabel =
    props.inputType === "net" ? props.t.toTakeHome : props.t.offeredGross
  return (
    <section
      className="flex min-w-0 flex-col gap-4 rounded-bl-[24px] rounded-br-[24px] rounded-tr-[24px] border border-border bg-surface p-4 desktop:p-6"
      aria-labelledby="decision-title"
    >
      <div className="hidden tablet:block desktop:min-h-[58px]">
        <p className="text-xs font-semibold text-content-secondary desktop:normal-case">
          {props.t.yourDecision}
        </p>
        <h2
          id="decision-title"
          className="mt-[3px] font-display text-xl font-bold leading-tight tablet:text-[27px]"
        >
          <span>
            {decisionLabel} {target} {props.t.perMonth}{" "}
          </span>
          <span className="font-normal">· {targetConversions}</span>
        </h2>
      </div>
      <h2
        id="decision-title-mobile"
        className="text-xs font-semibold uppercase text-content-secondary tablet:hidden"
      >
        {decisionLabel} {target} / {props.t.monthShort}
      </h2>
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
          className="border-0 bg-transparent px-0 text-content-inverse hover:bg-transparent tablet:border tablet:border-border-strong tablet:bg-surface tablet:px-4 tablet:text-content-secondary tablet:hover:bg-surface-subtle"
        >
          <span className="hidden tablet:inline">{props.t.compareOffers}</span>
        </Button>
      </section>
    </section>
  )
}
