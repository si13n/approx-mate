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

interface BreakdownItem {
  label: string
  percentage: number
  color: string
}

function MoneyBreakdown({
  items,
  t,
  linkTone,
}: {
  items: BreakdownItem[]
  t: Translation
  linkTone: string
}) {
  let offset = 0
  const stops = items.flatMap((item) => {
    const start = offset
    offset += item.percentage
    return [`${item.color} ${start}%`, `${item.color} ${offset}%`]
  })

  return (
    <div className="flex min-w-0 flex-col gap-2.5">
      <p className="text-xs font-semibold leading-4">{t.whereMoneyGoes}</p>
      <div
        className="h-2.5 w-full rounded-[4px]"
        style={{
          backgroundImage: `linear-gradient(90deg, ${stops.join(", ")})`,
        }}
        role="img"
        aria-label={items
          .map((item) => `${item.label}: ${item.percentage}%`)
          .join(", ")}
      />
      <div className="grid h-[34px] grid-cols-[0.9fr_1.25fr_0.85fr] gap-2 text-xs leading-[17px]">
        {items.map((item) => (
          <div key={item.label} className="flex min-w-0 items-start gap-2">
            <span
              className="mt-1 size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />
            <span className="min-w-0">
              <span className="block whitespace-nowrap">{item.label}</span>
              <span className="block">{item.percentage}%</span>
            </span>
          </div>
        ))}
      </div>
      <span className={`text-xs font-semibold leading-4 ${linkTone}`}>
        {t.seeCalculation} <span aria-hidden="true">→</span>
      </span>
    </div>
  )
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
  const takeHomeLabel = `${t.takeHomeLabel.charAt(0).toUpperCase()}${t.takeHomeLabel.slice(1)}`
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
  const breakdownItems: BreakdownItem[] = isB2B
    ? [
        { label: takeHomeLabel, percentage: 66, color: "#2563eb" },
        {
          label: t.taxAndContributions,
          percentage: 22,
          color: "#bfd7fe",
        },
        { label: t.businessCosts, percentage: 12, color: "#94a3b8" },
      ]
    : [
        { label: takeHomeLabel, percentage: 52, color: "#0891b2" },
        {
          label: t.taxAndContributions,
          percentage: 35,
          color: "#a5f3fc",
        },
        { label: t.benefitsShare, percentage: 13, color: "#94a3b8" },
      ]

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
      <MoneyBreakdown items={breakdownItems} t={t} linkTone={textTone} />
    </article>
  )
}
