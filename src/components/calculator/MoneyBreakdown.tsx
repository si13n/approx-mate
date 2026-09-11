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
  const labourFund =
    hasIncome && "labourFund" in calculation ? calculation.labourFund : 0
  const health = hasIncome ? calculation.healthContribution : 0
  const ppk =
    hasIncome && "ppkContribution" in calculation
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
    ? ["#7a45fa", "#40abff", "#aeb8d0"]
    : ["#40abff", "#87c8f6", "#98a6c5"]
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
    ...(breakdown.labourFund > 0
      ? [{ label: t.labourFundLabel, amount: breakdown.labourFund }]
      : []),
    { label: t.healthInsuranceLabel, amount: breakdown.health },
    ...(breakdown.ppk > 0 ? [{ label: t.ppk, amount: breakdown.ppk }] : []),
    { label: takeHomeLabel, amount: breakdown.net },
  ]

  return (
    <div className="flex min-w-0 flex-col gap-2.5">
      <p className="text-xs font-medium leading-4 text-text-primary">
        {t.whereMoneyGoes}
      </p>
      {breakdown.shortfall > 0 ? (
        <p role="status" className="text-xs leading-4 text-danger">
          {t.contributionShortfall} {fmt(breakdown.shortfall, "PLN", 2)}
        </p>
      ) : (
        <div
          className="h-1.5 w-full rounded-full bg-border"
          style={{
            backgroundImage:
              breakdown.gross > 0
                ? `linear-gradient(90deg, ${stops.join(", ")})`
                : undefined,
          }}
          role="img"
          aria-label={`${t.whereMoneyGoes}: ${items
            .map(
              (item) =>
                `${item.label}: ${item.percentage.toFixed(1)}% (${fmt(item.amount, "PLN", 2)})`,
            )
            .join(", ")}`}
        />
      )}
      <div className="grid grid-cols-3 gap-2 text-[9px] leading-[13px] text-text-secondary min-[360px]:text-[10px] desktop:text-[11px]">
        {items.map((item) => (
          <div key={item.label} className="min-w-0">
            <span className="min-w-0">
              <span className="block">{item.label}</span>
              <span className="block tabular-nums">
                {item.percentage.toFixed(1)}%
              </span>
            </span>
          </div>
        ))}
      </div>
      <details className="group text-xs leading-4">
        <summary
          className={`flex w-fit cursor-pointer list-none items-center gap-1 border-b border-dashed border-current rounded text-xs font-normal focus-visible:outline-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden ${
            isB2B ? "text-[#7541f3]" : "text-[#269ce9]"
          }`}
        >
          {t.seeCalculation}
          <span
            aria-hidden="true"
            className="transition-transform group-open:rotate-90"
          >
            →
          </span>
        </summary>
        <dl className="mt-2 space-y-1.5 border-t border-border pt-2">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-baseline justify-between gap-2 last:border-t last:border-border last:pt-1.5 last:font-semibold"
            >
              <dt className="text-content-secondary">{row.label}</dt>
              <dd className="shrink-0 tabular-nums">
                {fmt(row.amount, "PLN", 2)}
              </dd>
            </div>
          ))}
        </dl>
      </details>
    </div>
  )
}
