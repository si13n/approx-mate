import type { Translation } from "../../i18n/translations"
import { fmt } from "../../lib/formatting"
import type {
  B2BCalculationResult,
  UoPCalculationResult,
} from "../../lib/taxCalculations"

type Calculation = B2BCalculationResult | UoPCalculationResult

export function getMonthlyBreakdown(calculation: Calculation) {
  // Empty input has no salary to allocate, even when B2B has fixed contributions.
  const hasIncome = calculation.monthlyGross > 0
  const gross = hasIncome ? calculation.monthlyGross : 0
  const net = hasIncome ? calculation.monthlyNet : 0
  const tax = hasIncome ? calculation.incomeTax : 0
  const social = hasIncome
    ? "socialZUS" in calculation
      ? calculation.socialZUS
      : calculation.socialContributions
    : 0
  const labourFund = hasIncome && "labourFund" in calculation ? calculation.labourFund : 0
  const health = hasIncome ? calculation.healthContribution : 0
  const ppk = hasIncome && "ppkContribution" in calculation
    ? calculation.ppkContribution
    : 0
  const contributions = social + labourFund + health + ppk
  const shortfall = Math.max(0, tax + contributions - gross)
  const shares = [net, tax, contributions].map((amount) => ({
    amount,
    percentage: gross > 0 ? (amount / gross) * 100 : 0,
  }))
  return { gross, net, tax, social, labourFund, health, ppk, shortfall, shares }
}

export function MoneyBreakdown({
  calculation,
  contract,
  t,
}: {
  calculation: Calculation
  contract: "B2B" | "UoP"
  t: Translation
}) {
  const breakdown = getMonthlyBreakdown(calculation)
  const isB2B = contract === "B2B"
  const takeHomeLabel = `${t.takeHomeLabel.charAt(0).toUpperCase()}${t.takeHomeLabel.slice(1)}`
  const labels = [takeHomeLabel, t.incomeTaxLabel, t.contributionsLabel]
  const colors = isB2B
    ? ["#2563eb", "#bfd7fe", "#94a3b8"]
    : ["#0891b2", "#a5f3fc", "#94a3b8"]
  const items = breakdown.shares.map((share, index) => ({
    ...share,
    label: labels[index],
    color: colors[index],
  }))
  let offset = 0
  const stops = items.flatMap((item) => {
    const start = offset
    offset += item.percentage
    return [`${item.color} ${start}%`, `${item.color} ${offset}%`]
  })
  const rows = [
    { label: isB2B ? t.invoiceLabel : t.grossLabel, amount: breakdown.gross },
    { label: t.incomeTaxLabel, amount: breakdown.tax },
    { label: t.socialInsuranceLabel, amount: breakdown.social },
    ...(breakdown.labourFund > 0 ? [{ label: t.labourFundLabel, amount: breakdown.labourFund }] : []),
    { label: t.healthInsuranceLabel, amount: breakdown.health },
    ...(breakdown.ppk > 0 ? [{ label: t.ppk, amount: breakdown.ppk }] : []),
    { label: takeHomeLabel, amount: breakdown.net },
  ]

  return (
    <div className="flex min-w-0 flex-col gap-2.5">
      <p className="text-xs font-semibold leading-4">{t.whereMoneyGoes}</p>
      {breakdown.shortfall > 0 ? (
        <p role="status" className="text-xs leading-4 text-danger">
          {t.contributionShortfall} {fmt(breakdown.shortfall, "PLN", 2)}
        </p>
      ) : (
        <div
          className="h-2.5 w-full rounded-[4px] bg-border"
          style={{
            backgroundImage: breakdown.gross > 0
              ? `linear-gradient(90deg, ${stops.join(", ")})`
              : undefined,
          }}
          role="img"
          aria-label={`${t.whereMoneyGoes}: ${items
            .map((item) => `${item.label}: ${item.percentage.toFixed(1)}% (${fmt(item.amount, "PLN", 2)})`)
            .join(", ")}`}
        />
      )}
      <div className="grid grid-cols-3 gap-2 text-xs leading-[17px]">
        {items.map((item) => (
          <div key={item.label} className="flex min-w-0 items-start gap-1.5">
            <span
              className="mt-1 size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />
            <span className="min-w-0">
              <span className="block">{item.label}</span>
              <span className="block tabular-nums">{item.percentage.toFixed(1)}%</span>
            </span>
          </div>
        ))}
      </div>
      <details className="group text-xs leading-4">
        <summary className={`flex cursor-pointer list-none items-center gap-1 rounded font-semibold focus-visible:outline-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden ${isB2B ? "text-action" : "text-accent"}`}>
          {t.seeCalculation}
          <span aria-hidden="true" className="transition-transform group-open:rotate-90">→</span>
        </summary>
        <dl className="mt-2 space-y-1.5 border-t border-border pt-2">
          {rows.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-2 last:border-t last:border-border last:pt-1.5 last:font-semibold">
              <dt className="text-content-secondary">{row.label}</dt>
              <dd className="shrink-0 tabular-nums">{fmt(row.amount, "PLN", 2)}</dd>
            </div>
          ))}
        </dl>
      </details>
    </div>
  )
}
