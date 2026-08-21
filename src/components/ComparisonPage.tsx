import { useState, useMemo } from "react";

type Currency = "PLN" | "USD" | "EUR";
type ContractType = "B2B" | "UoP";

interface Offer {
  id: string;
  name: string;
  amount: number;
  currency: Currency;
  contractType: ContractType;
}

interface ComparisonPageProps {
  onBack: () => void;
}

const RATES: Record<string, number> = { PLN_PLN: 1, USD_PLN: 3.85, EUR_PLN: 4.25 };
function toPLN(a: number, from: Currency) { return a * (RATES[`${from}_PLN`] ?? 1); }
function fromPLN(a: number, to: Currency) { return a / (RATES[`${to}_PLN`] ?? 1); }

const SYM: Record<Currency, string> = { USD: "$", EUR: "€", PLN: "" };
const SUF: Record<Currency, string> = { USD: "", EUR: "", PLN: " PLN" };
function fmt(amount: number, currency: Currency, dec = 0): string {
  const n = Math.round(amount * 10 ** dec) / 10 ** dec;
  return `${SYM[currency]}${n.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec })}${SUF[currency]}`;
}

export function ComparisonPage({ onBack }: ComparisonPageProps) {
  const [offers, setOffers] = useState<Offer[]>([
    { id: "1", name: "Offer A", amount: 25000, currency: "PLN", contractType: "B2B" },
    { id: "2", name: "Offer B", amount: 22000, currency: "PLN", contractType: "UoP" },
  ]);

  const hoursPerMonth = 160;

  const calculations = useMemo(() => {
    return offers.map((offer) => {
      const monthlyPLN = toPLN(offer.amount, offer.currency);
      // Simplified calculation - just use the amount as net for demo
      const netPLN = monthlyPLN * 0.75; // Roughly 75% net for simplicity
      const hourlyNet = netPLN / hoursPerMonth;
      const hourlyGross = monthlyPLN / hoursPerMonth;

      return {
        ...offer,
        monthlyPLN,
        netPLN,
        netPerYear: netPLN * 12,
        hourlyNet,
        hourlyGross,
      };
    });
  }, [offers]);

  const bestTakeHome = useMemo(() => {
    if (calculations.length === 0) return null;
    return calculations.reduce((best, current) =>
      current.netPLN > best.netPLN ? current : best
    );
  }, [calculations]);

  const handleAddOffer = () => {
    if (offers.length < 3) {
      const newId = String(Math.max(...offers.map(o => parseInt(o.id) || 0)) + 1);
      setOffers([...offers, {
        id: newId,
        name: `Offer ${String.fromCharCode(65 + offers.length)}`,
        amount: 20000,
        currency: "PLN",
        contractType: "B2B",
      }]);
    }
  };

  const handleRemoveOffer = (id: string) => {
    setOffers(offers.filter(o => o.id !== id));
  };

  const handleUpdateOffer = (id: string, field: keyof Offer, value: any) => {
    setOffers(offers.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  return (
    <div className="min-h-screen w-full" style={{ background: "var(--color-background)", fontFamily: "var(--font-body)" }}>
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Header with back button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: "var(--color-muted-foreground)" }}
          >
            ← Back
          </button>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.875rem", fontWeight: 600, color: "var(--color-foreground)", margin: 0 }}>
              Compare offers
            </h1>
            <p style={{ fontSize: "0.875rem", color: "var(--color-muted-foreground)", margin: "0.25rem 0 0 0" }}>
              Compare B2B and UoP offers side by side
            </p>
          </div>
        </div>

        {/* Offer cards */}
        <div className="flex gap-3 flex-wrap">
          {calculations.map((offer, idx) => (
            <div
              key={offer.id}
              className="rounded-2xl p-4 flex flex-col gap-2 flex-1 min-w-xs"
              style={{
                background: "#fff",
                border: bestTakeHome?.id === offer.id ? "2px solid #3B82F6" : "1px solid var(--color-border)",
                boxShadow: bestTakeHome?.id === offer.id ? "0 0 0 4px rgba(59,130,246,0.1)" : "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: ["#3B82F6", "#06B6D4", "#A855F7"][idx % 3] }}
                  />
                  <span className="text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>
                    {offer.name}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveOffer(offer.id)}
                  className="text-lg transition-opacity hover:opacity-50"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-muted-foreground)" }}
                >
                  ⋮
                </button>
              </div>
              <div className="text-2xl font-bold" style={{ color: "var(--color-foreground)", fontFamily: "var(--font-display)" }}>
                {fmt(offer.amount, offer.currency)}
              </div>
              <div className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                {offer.contractType}
              </div>
            </div>
          ))}

          {offers.length < 3 && (
            <button
              onClick={handleAddOffer}
              className="rounded-2xl p-4 flex items-center justify-center flex-1 min-w-xs transition-all hover:opacity-80"
              style={{
                background: "var(--color-muted)",
                border: "1px dashed var(--color-border)",
                color: "var(--color-muted-foreground)",
                cursor: "pointer",
                fontSize: "2rem",
              }}
            >
              +
            </button>
          )}
        </div>

        {/* Best take-home section */}
        {bestTakeHome && (
          <div
            className="rounded-2xl p-6"
            style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">🏆</div>
              <div className="flex-1">
                <div className="text-xs font-medium mb-1" style={{ color: "var(--color-muted-foreground)" }}>
                  Best take-home
                </div>
                <div className="text-2xl font-bold mb-1" style={{ color: "#3B82F6", fontFamily: "var(--font-display)" }}>
                  {bestTakeHome.name}
                </div>
                <div className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                  Highest net per month
                </div>
              </div>
              {calculations.map((offer, idx) => {
                if (offer.id === bestTakeHome.id) return null;
                const diff = bestTakeHome.netPLN - offer.netPLN;
                return (
                  <div key={offer.id} className="text-right">
                    <div className="text-sm font-semibold" style={{ color: "#10B981" }}>
                      ↑ {fmt(diff, "PLN", 0)}/mo
                    </div>
                    <div className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                      vs {offer.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Comparison table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}
        >
          <div className="overflow-x-auto">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      color: "var(--color-muted-foreground)",
                      background: "var(--color-muted)",
                    }}
                  >
                    &nbsp;
                  </th>
                  {calculations.map((offer, idx) => (
                    <th
                      key={offer.id}
                      style={{
                        padding: "1rem",
                        textAlign: "center",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        color: "var(--color-foreground)",
                        background: "var(--color-muted)",
                      }}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: ["#3B82F6", "#06B6D4", "#A855F7"][idx % 3] }}
                        />
                        {offer.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Contract type", render: (o: any) => o.contractType },
                  { label: "Gross / invoice per month", render: (o: any) => fmt(o.amount, o.currency) },
                  {
                    label: "Net per month",
                    render: (o: any) => (
                      <span style={{ color: "#3B82F6", fontWeight: 600 }}>
                        {fmt(o.netPLN, "PLN", 0)}
                        {bestTakeHome?.id === o.id && (
                          <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", color: "var(--color-muted-foreground)" }}>
                            Best
                          </span>
                        )}
                      </span>
                    ),
                  },
                  { label: "Net per year", render: (o: any) => fmt(o.netPerYear, "PLN", 0) },
                  {
                    label: "Hourly net (160 h/month)",
                    render: (o: any) => (
                      <span style={{ color: "#3B82F6", fontWeight: 600 }}>
                        {fmt(o.hourlyNet, "PLN", 2)}
                        {bestTakeHome?.id === o.id && (
                          <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", color: "var(--color-muted-foreground)" }}>
                            Best
                          </span>
                        )}
                      </span>
                    ),
                  },
                  { label: "Hourly gross (160 h/month)", render: (o: any) => fmt(o.hourlyGross, "PLN", 2) },
                  { label: "Currency", render: (o: any) => o.currency },
                  { label: "Notes", render: (o: any) => o.contractType === "UoP" ? "Standard employment contract" : "No notes" },
                ].map((row, rowIdx) => (
                  <tr key={rowIdx} style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <td
                      style={{
                        padding: "1rem",
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        color: "var(--color-muted-foreground)",
                        background: "var(--color-muted)",
                      }}
                    >
                      {row.label}
                    </td>
                    {calculations.map((offer) => (
                      <td
                        key={offer.id}
                        style={{
                          padding: "1rem",
                          textAlign: "center",
                          fontSize: "0.875rem",
                          color: "var(--color-foreground)",
                        }}
                      >
                        {row.render(offer)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assumptions */}
        <div
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}
        >
          <div style={{ fontSize: "1.25rem" }}>📋</div>
          <div className="flex-1">
            <span style={{ fontSize: "0.875rem", color: "var(--color-muted-foreground)" }}>
              <strong>Assumptions:</strong> 160 h/month · Poland 2026 · Approximate estimates
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
