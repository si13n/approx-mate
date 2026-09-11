import type { Translation } from "../../i18n/translations"
import { fmt, fromPLN } from "../../lib/formatting"
import { fromMonthlyAmount } from "../../lib/salaryPeriod"
import type {
  B2BCalculationResult,
  UoPCalculationResult,
} from "../../lib/taxCalculations"
import { MoneyBreakdown } from "./MoneyBreakdown"
import type { Currency, InputType, SalaryInputPeriod } from "../../types"

interface OfferResultCardProps {
  contract: "B2B" | "UoP"
  calculation: B2BCalculationResult | UoPCalculationResult
  inputType: InputType
  period: SalaryInputPeriod
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
  period,
  rates,
  hoursPerMonth,
  t,
}: OfferResultCardProps) {
  const isB2B = contract === "B2B"
  const { monthlyGross: grossPLN, monthlyNet: netPLN } = calculation
  const monthlyHeadlinePLN = inputType === "net" ? grossPLN : netPLN
  const headlinePLN = fromMonthlyAmount(monthlyHeadlinePLN, period)
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
  const formattedHeadline =
    period === "hour" ? fmt(headlinePLN, "PLN", 2) : plnCompact(headlinePLN)
  const tone = isB2B ? "bg-[#f7f3ff]" : "bg-[#edf7ff]"
  const textTone = isB2B ? "text-[#7541f3]" : "text-[#269ce9]"

  return (
    <article
      className={`flex min-w-0 flex-col gap-3 rounded-[16px] p-4 desktop:min-h-[310px] desktop:p-[18px] ${tone}`}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className={`font-display text-sm font-medium ${textTone}`}>
          {contract}
        </h3>
        <span className={`text-xs font-medium ${textTone}`}>
          • {isB2B ? t.higherCash : t.moreProtection}
        </span>
      </div>
      <p className="font-display text-[28px] font-bold leading-tight tabular-nums text-text-primary">
        ≈ {formattedHeadline} {headlineSuffix}
      </p>
      <p className="text-xs text-text-secondary">
        {conversions(headlinePLN, period === "hour" ? 2 : 0)}
      </p>
      <div className="flex min-w-0 flex-col gap-2 text-[10px] font-normal text-text-secondary min-[360px]:text-[11px] desktop:text-xs">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <span className="shrink-0 uppercase">{t.grossPerHour}</span>
          <span className="min-w-0 whitespace-nowrap text-right tabular-nums text-text-primary">
            {fmt(grossPLN / hoursPerMonth, "PLN", 2)} ·{" "}
            {conversions(grossPLN / hoursPerMonth, 2)}
          </span>
        </div>
        <div className="flex min-w-0 items-center justify-between gap-2">
          <span className="shrink-0 uppercase">{t.netPerHour}</span>
          <span className="min-w-0 whitespace-nowrap text-right tabular-nums text-text-primary">
            {fmt(netPLN / hoursPerMonth, "PLN", 2)} ·{" "}
            {conversions(netPLN / hoursPerMonth, 2)}
          </span>
        </div>
      </div>
      <MoneyBreakdown calculation={calculation} contract={contract} t={t} />
    </article>
  )
}
