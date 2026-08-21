import { TaxProfile, TAX_2026, B2BZUSProfile } from "../config/tax";

interface TaxProfileDisplayProps {
  profile: TaxProfile;
  onB2BClick: () => void;
  onUoPClick: () => void;
  onCompareClick?: () => void;
}

function getB2BLabel(rate: number, zusProfile: B2BZUSProfile): string {
  const rateStr = `${Math.round(rate * 100)}%`;
  const zusLabel = {
    ulgaNaStart: "Ulga na start",
    preferential: "Preferential ZUS",
    full: "Full ZUS",
  }[zusProfile];
  return `B2B ${rateStr} · ${zusLabel}`;
}

function getUoPLabel(): string {
  return "UoP Standard";
}

export function TaxProfileDisplay({
  profile,
  onB2BClick,
  onUoPClick,
  onCompareClick,
}: TaxProfileDisplayProps) {
  const b2bLabel = getB2BLabel(profile.b2b.ryczaltRate, profile.b2b.zusProfile);
  const uoPLabel = getUoPLabel();

  return (
    <div className="flex items-center gap-2 px-1 mb-2">
      <p
        style={{
          fontSize: "0.75rem",
          color: "var(--color-muted-foreground)",
          fontWeight: 500,
          opacity: 0.7,
          whiteSpace: "nowrap",
        }}
      >
        Poland 2026
      </p>

      <div className="flex gap-2 items-center flex-wrap w-full">
        <button
          onClick={onB2BClick}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
          style={{
            background: "var(--color-muted)",
            color: "var(--color-foreground)",
            border: "1px solid var(--color-border)",
            cursor: "pointer",
          }}
        >
          {b2bLabel} <span style={{ marginLeft: "0.25rem", opacity: 0.6 }}>▾</span>
        </button>

        <button
          onClick={onUoPClick}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
          style={{
            background: "var(--color-muted)",
            color: "var(--color-foreground)",
            border: "1px solid var(--color-border)",
            cursor: "pointer",
          }}
        >
          {uoPLabel} <span style={{ marginLeft: "0.25rem", opacity: 0.6 }}>▾</span>
        </button>

        {onCompareClick && (
          <button
            onClick={onCompareClick}
            className="flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
            style={{
              background: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            COMPARE!
          </button>
        )}
      </div>
    </div>
  );
}
