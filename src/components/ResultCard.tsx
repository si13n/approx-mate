import { Currency, InputType } from "../types";
import { fmt, fromPLN } from "../lib/formatting";

interface ResultCardProps {
  label: string;
  grossPLN: number;
  netPLN: number;
  currency: Currency;
  inputType: InputType;
  hoursPerMonth: number;
  isB2B: boolean;
  badge?: string;
  badgeColor?: "blue" | "teal";
  t: Record<string, string>;
}

export function ResultCard({ label, grossPLN, netPLN, currency, inputType, hoursPerMonth, isB2B, badge, badgeColor = "blue", t }: ResultCardProps) {
  const primaryPLN = inputType === "net" ? grossPLN : netPLN;
  const secondaryPLN = inputType === "net" ? netPLN : grossPLN;
  const primaryLabel = inputType === "net" ? (isB2B ? t.invoice : t.brutto) : t.takeHome;
  const secondaryLabel = inputType === "net" ? t.takeHome : (isB2B ? t.invoice : t.brutto);
  const hourlyPrimaryPLN = primaryPLN / hoursPerMonth;
  const hourlySecPLN = secondaryPLN / hoursPerMonth;

  const ALL: Currency[] = ["USD", "EUR", "PLN"];
  const others = ALL.filter((c) => c !== currency);

  function allCurrencies(plnVal: number, dec = 0) {
    return others.map((c) => fmt(fromPLN(plnVal, c), c, dec)).join(" · ");
  }

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3 text-center"
      style={{ background: "#fff", border: "1px solid var(--color-border)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
    >
      {/* Header with badge */}
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{
            background: isB2B ? "rgba(59,130,246,0.1)" : "rgba(6,182,212,0.1)",
            color: isB2B ? "#2563EB" : "#0891B2",
          }}
        >
          {label}
        </span>
        {badge && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: badgeColor === "blue" ? "rgba(59,130,246,0.1)" : "rgba(6,182,212,0.1)",
              color: badgeColor === "blue" ? "#2563EB" : "#0891B2",
            }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Primary value */}
      <div>
        <div className="text-xs font-medium mb-1" style={{ color: "var(--color-muted-foreground)" }}>
          {primaryLabel}
        </div>
        <div
          className="font-bold tabular-nums leading-none"
          style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--color-foreground)", letterSpacing: "-0.03em" }}
        >
          {fmt(fromPLN(primaryPLN, currency), currency)}
          <span className="text-sm font-medium ml-1" style={{ color: "var(--color-muted-foreground)" }}>
            {t.perMonth}
          </span>
        </div>
        <div className="text-xs tabular-nums mt-1 leading-relaxed" style={{ color: "var(--color-muted-foreground)" }}>
          {allCurrencies(primaryPLN)}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "var(--color-border)" }} />

      {/* Secondary value */}
      <div>
        <div className="text-xs font-medium mb-0.5" style={{ color: "var(--color-muted-foreground)" }}>
          {secondaryLabel}
        </div>
        <div
          className="font-semibold tabular-nums"
          style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "var(--color-foreground)" }}
        >
          {fmt(fromPLN(secondaryPLN, currency), currency)}
        </div>
        <div className="text-xs tabular-nums mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
          {allCurrencies(secondaryPLN)}
        </div>
      </div>

      {/* Hourly rates — all currencies */}
      <div className="rounded-xl px-3 py-3 flex flex-col gap-3" style={{ background: "var(--color-muted)" }}>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: `Gross${t.perHour}`, plnVal: hourlyPrimaryPLN },
            { label: `Net${t.perHour}`, plnVal: hourlySecPLN },
          ].map(({ label, plnVal }) => (
            <div key={label} className="flex flex-col gap-1">
              <div className="text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>
                {label}
              </div>
              <div className="text-sm font-semibold tabular-nums" style={{ fontFamily: "var(--font-display)", color: "var(--color-foreground)" }}>
                {fmt(fromPLN(plnVal, currency), currency, 2)}
              </div>
              {/* All currencies for this rate */}
              <div className="text-xs tabular-nums space-y-0.5">
                {["USD", "EUR", "PLN"].map((c) => (
                  <div key={c} style={{ color: "var(--color-muted-foreground)" }}>
                    {fmt(fromPLN(plnVal, c as Currency), c as Currency, 2)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
