import { useState, useMemo } from "react";

type Currency = "PLN" | "USD" | "EUR";
type ContractType = "B2B" | "UoP";
type InputType = "gross" | "net";

interface Offer {
  id: string;
  name: string;
  amount: number;
  currency: Currency;
  contractType: ContractType;
  inputType: InputType;
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
    { id: "1", name: "Offer A", amount: 25000, currency: "PLN", contractType: "B2B", inputType: "gross" },
    { id: "2", name: "Offer B", amount: 22000, currency: "PLN", contractType: "UoP", inputType: "net" },
  ]);

  const hoursPerMonth = 160;

  const calculations = useMemo(() => {
    return offers.map((offer) => {
      const monthlyPLN = toPLN(offer.amount, offer.currency);

      // If inputType is "gross", use it as gross; if "net", treat it as net
      let grossPLN: number;
      let netPLN: number;

      if (offer.inputType === "gross") {
        grossPLN = monthlyPLN;
        // Simplified: assume ~75% net for gross input
        netPLN = monthlyPLN * 0.75;
      } else {
        netPLN = monthlyPLN;
        // Simplified: assume ~133% gross for net input (inverse of 75%)
        grossPLN = monthlyPLN / 0.75;
      }

      const hourlyNet = netPLN / hoursPerMonth;
      const hourlyGross = grossPLN / hoursPerMonth;

      return {
        ...offer,
        monthlyPLN,
        grossPLN,
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
        inputType: "gross",
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
          {offers.map((offer, idx) => (
            <div
              key={offer.id}
              className="rounded-2xl p-4 flex flex-col gap-3 flex-1 min-w-sm"
              style={{
                background: "#fff",
                border: bestTakeHome?.id === offer.id ? "2px solid #3B82F6" : "1px solid var(--color-border)",
                boxShadow: bestTakeHome?.id === offer.id ? "0 0 0 4px rgba(59,130,246,0.1)" : "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              {/* Header */}
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
                  className="text-xl font-bold transition-opacity hover:opacity-50"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#EF4444" }}
                >
                  ✕
                </button>
              </div>

              {/* Amount input */}
              <input
                type="number"
                min="0"
                max="50000"
                value={offer.amount}
                onChange={(e) => handleUpdateOffer(offer.id, "amount", parseInt(e.target.value) || 0)}
                className="w-full rounded-lg px-3 py-2 outline-none"
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  fontFamily: "var(--font-display)",
                  background: "var(--color-muted)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-foreground)",
                }}
              />

              {/* Contract type toggle */}
              <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
                {(["B2B", "UoP"] as ContractType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleUpdateOffer(offer.id, "contractType", type)}
                    className="py-2 text-xs font-medium transition-all"
                    style={{
                      background: offer.contractType === type ? "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)" : "var(--color-muted)",
                      color: offer.contractType === type ? "#fff" : "var(--color-muted-foreground)",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Input type toggle */}
              <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
                {(["gross", "net"] as InputType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleUpdateOffer(offer.id, "inputType", type)}
                    className="py-2 text-xs font-medium transition-all capitalize"
                    style={{
                      background: offer.inputType === type ? "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)" : "var(--color-muted)",
                      color: offer.inputType === type ? "#fff" : "var(--color-muted-foreground)",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {offers.length < 3 && (
            <button
              onClick={handleAddOffer}
              className="rounded-2xl p-4 flex items-center justify-center flex-1 min-w-sm transition-all hover:opacity-80"
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

        {/* Comparison table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}
        >
          {/* Best take-home section - inside table */}
          {bestTakeHome && (
            <div
              className="p-6 border-b"
              style={{ borderColor: "var(--color-border)" }}
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
                  { label: "Gross / invoice per month", render: (o: any) => fmt(o.grossPLN, "PLN", 0) },
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
