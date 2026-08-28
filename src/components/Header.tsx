import { Lang } from "../types";

interface HeaderProps {
  lang: Lang;
  onLanguageChange: (lang: Lang) => void;
  b2bLabel?: string;
  uopLabel?: string;
  onEditTaxProfile: () => void;
  onCompare: () => void;
}

export function Header({
  lang,
  onLanguageChange,
  b2bLabel,
  uopLabel,
  onEditTaxProfile,
  onCompare,
}: HeaderProps) {
  return (
    <div
      className="mb-8"
      style={{
        background: "var(--color-background)",
        borderBottom: "1px solid var(--color-border)",
        paddingBottom: "1rem",
      }}
    >
      {/* Top row: Logo + Language */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: 40,
              height: 40,
              background: "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)",
              boxShadow: "0 2px 8px rgba(59,130,246,0.3)",
            }}
          >
            <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fff", fontFamily: "var(--font-display)" }}>≈</span>
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: "var(--color-foreground)" }}>
            approxmate
          </span>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-2" style={{ fontSize: "0.75rem" }}>
          {(["en", "pl", "ua"] as Lang[]).map((l, i) => (
            <span key={l}>
              {i > 0 && <span style={{ color: "var(--color-muted-foreground)", margin: "0 0.5rem" }}>|</span>}
              <button
                onClick={() => onLanguageChange(l)}
                className="uppercase transition-opacity hover:opacity-100"
                style={{
                  background: "none",
                  border: "none",
                  color: lang === l ? "var(--color-foreground)" : "var(--color-muted-foreground)",
                  cursor: "pointer",
                  padding: 0,
                  fontWeight: lang === l ? 500 : 400,
                  opacity: lang === l ? 1 : 0.6,
                }}
              >
                {l}
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Bottom row: Poland 2026 + Tax profile + Compare button */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium" style={{ color: "var(--color-muted-foreground)" }}>
            Poland 2026
          </span>
          <div className="flex items-center gap-2">
            {b2bLabel && (
              <span
                className="text-xs font-semibold px-2 py-1 rounded-full cursor-pointer hover:opacity-75"
                onClick={onEditTaxProfile}
                style={{
                  background: "rgba(59,130,246,0.1)",
                  color: "#2563EB",
                }}
              >
                {b2bLabel}
              </span>
            )}
            {uopLabel && (
              <span
                className="text-xs font-semibold px-2 py-1 rounded-full cursor-pointer hover:opacity-75"
                onClick={onEditTaxProfile}
                style={{
                  background: "rgba(6,182,212,0.1)",
                  color: "#0891B2",
                }}
              >
                {uopLabel}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={onCompare}
          className="px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #FF9500 0%, #FB923C 100%)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-display)",
            fontSize: "0.875rem",
          }}
        >
          COMPARE!
        </button>
      </div>
    </div>
  );
}
