import type { Translation } from "../../i18n/translations"
import { fmt, fromPLN } from "../../lib/formatting"
import type { Currency, InputType } from "../../types"

interface OfferResultCardProps {
  contract: "B2B" | "UoP"
  grossPLN: number
  netPLN: number
  currency: Currency
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
  grossPLN,
  netPLN,
  currency,
  inputType,
  rates,
  hoursPerMonth,
  t,
}: OfferResultCardProps) {
  const isB2B = contract === "B2B"
  const headlinePLN = inputType === "net" ? grossPLN : netPLN
  const headlineSuffix =
    inputType === "net"
      ? isB2B
        ? t.invoiceLabel
        : t.grossLabel.toLowerCase()
      : t.takeHomeLabel
  const equivalentLabel =
    inputType === "net"
      ? isB2B
        ? t.invoiceEquivalent
        : t.grossEquivalent
      : t.takeHome
  const conversions = (value: number, dec = 0) =>
    (["USD", "EUR"] as Currency[])
      .map((item) => fmt(fromPLN(value, item, rates), item, dec))
      .join(" · ")
  const tone = isB2B
    ? "border-primary-border bg-primary-subtle"
    : "border-accent-border bg-accent-subtle"
  const textTone = isB2B ? "text-action" : "text-accent"

  return (
    <article
      className={`flex flex-col gap-1.5 rounded-[14px] border p-3 tablet:rounded-[18px] tablet:p-[18px] ${tone}`}
    >
      <div className="flex min-h-6 items-center justify-between gap-2">
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
        {equivalentLabel} · {conversions(headlinePLN)}
      </p>
      {inputType === "net" && (
        <div className="text-xs text-content-secondary tablet:hidden">
          <p className="font-semibold">{t.takeHome}</p>
          <p>
            {plnCompact(netPLN)} · {conversions(netPLN)}
          </p>
        </div>
      )}
      <div className="mt-1 grid grid-cols-2 gap-2 rounded-[10px] bg-white/70 px-2.5 py-2 text-xs">
        <div>
          <p className="font-semibold">{t.grossPerHour}</p>
          <p>{fmt(grossPLN / hoursPerMonth, "PLN", 2)}</p>
          <p>{conversions(grossPLN / hoursPerMonth, 2)}</p>
        </div>
        <div>
          <p className="font-semibold">{t.netPerHour}</p>
          <p>{fmt(netPLN / hoursPerMonth, "PLN", 2)}</p>
          <p>{conversions(netPLN / hoursPerMonth, 2)}</p>
        </div>
      </div>
    </article>
  )
}
