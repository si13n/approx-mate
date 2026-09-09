import type { Translation } from "../../i18n/translations"
import { fmt, fromPLN } from "../../lib/formatting"
import type {
  B2BCalculationResult,
  UoPCalculationResult,
} from "../../lib/taxCalculations"
import { MoneyBreakdown } from "./MoneyBreakdown"
import type { Currency, InputType } from "../../types"

interface OfferResultCardProps {
  contract: "B2B" | "UoP"
  calculation: B2BCalculationResult | UoPCalculationResult
  inputType: InputType
  rates: Record<string, number>
  hoursPerMonth: number
  t: Translation
}

function plnCompact(value: number) {
  return `${Math.round(value / 100) / 10}k PLN`
}

export function OfferResultCard({
  contract,
  calculation,
  inputType,
  rates,
  hoursPerMonth,
  t,
}: OfferResultCardProps) {
  const isB2B = contract === "B2B"
  const { monthlyGross: grossPLN, monthlyNet: netPLN } = calculation
  const headlinePLN = inputType === "net" ? grossPLN : netPLN
  const headlineSuffix =
    inputType === "net"
      ? isB2B
        ? t.invoiceLabel
        : t.grossLabel.toLowerCase()
      : t.takeHomeLabel
  const conversions = (value: number, dec = 0) =>
    (["USD", "EUR"] as Currency[])
      .map((item) => fmt(fromPLN(value, item, rates), item, dec))
      .join(" · ")
  const tone = isB2B
    ? "border-primary bg-primary-subtle"
    : "border-[#0891b2] bg-accent-subtle"
  const textTone = isB2B ? "text-action" : "text-accent"

  return (
    <article
      className={`flex min-w-0 flex-col gap-[7px] rounded-[14px] border p-3 tablet:min-h-[315px] tablet:rounded-[18px] tablet:p-[18px] ${tone}`}
    >
      <div className="flex h-7 items-center justify-between gap-2">
        <h3 className="font-display text-sm font-semibold tablet:text-base">
          {contract}
        </h3>
        <span
          className={`rounded-full bg-surface px-2 py-1 text-[11px] font-semibold tablet:text-xs ${textTone}`}
        >
          {isB2B ? t.higherCash : t.moreProtection}
        </span>
      </div>
      <p className="font-display text-2xl font-bold tabular-nums tablet:text-[29px]">
        ≈ {plnCompact(headlinePLN)} {headlineSuffix}
      </p>
      <p className={`text-xs font-medium ${textTone}`}>
        {conversions(headlinePLN)}
      </p>
      <div className="flex h-[65px] min-w-0 flex-col text-[11px] font-semibold tablet:text-xs">
        <div className="flex h-8 min-w-0 items-center justify-between gap-2">
          <span className="shrink-0 text-content-secondary">
            {t.grossPerHour}
          </span>
          <span className="min-w-0 whitespace-nowrap text-right tabular-nums">
            {fmt(grossPLN / hoursPerMonth, "PLN", 2)} ·{" "}
            {conversions(grossPLN / hoursPerMonth, 2)}
          </span>
        </div>
        <div className="h-px shrink-0 bg-border" />
        <div className="flex h-8 min-w-0 items-center justify-between gap-2">
          <span className="shrink-0 text-content-secondary">
            {t.netPerHour}
          </span>
          <span className="min-w-0 whitespace-nowrap text-right tabular-nums">
            {fmt(netPLN / hoursPerMonth, "PLN", 2)} ·{" "}
            {conversions(netPLN / hoursPerMonth, 2)}
          </span>
        </div>
      </div>
      <MoneyBreakdown calculation={calculation} contract={contract} t={t} />
    </article>
  )
}
