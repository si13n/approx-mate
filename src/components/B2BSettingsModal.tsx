import { TaxProfile, TAX_2026, B2BZUSProfile, DEFAULT_TAX_PROFILE } from "../config/tax";
import { trackB2BRateChanged, trackB2BZUSChanged, trackB2BSicknessChanged, trackTaxProfileReset } from "../lib/analytics";

interface B2BSettingsModalProps {
  profile: TaxProfile;
  onUpdate: (profile: TaxProfile) => void;
  onReset: () => void;
  onClose: () => void;
}

export function B2BSettingsModal({
  profile,
  onUpdate,
  onReset,
  onClose,
}: B2BSettingsModalProps) {
  const handleRateChange = (rate: number) => {
    onUpdate({
      ...profile,
      b2b: { ...profile.b2b, ryczaltRate: rate },
    });
    trackB2BRateChanged(rate);
  };

  const handleZUSChange = (zusProfile: B2BZUSProfile) => {
    onUpdate({
      ...profile,
      b2b: { ...profile.b2b, zusProfile },
    });
    trackB2BZUSChanged(zusProfile);
  };

  const handleSicknessChange = (enabled: boolean) => {
    onUpdate({
      ...profile,
      b2b: { ...profile.b2b, sicknesInsurance: enabled },
    });
    trackB2BSicknessChanged(enabled);
  };

  const handleReset = () => {
    trackTaxProfileReset();
    onReset();
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--color-background)",
          borderRadius: "1rem",
          padding: "1.5rem",
          maxWidth: "400px",
          width: "90%",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            marginBottom: "1.5rem",
            color: "var(--color-foreground)",
          }}
        >
          B2B settings
        </h2>

        {/* Ryczałt rate */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              display: "block",
              fontSize: "0.75rem",
              fontWeight: 500,
              marginBottom: "0.75rem",
              color: "var(--color-muted-foreground)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Ryczałt rate
          </label>
          <select
            value={profile.b2b.ryczaltRate}
            onChange={(e) => handleRateChange(parseFloat(e.target.value))}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              border: "1px solid var(--color-border)",
              background: "var(--color-card)",
              color: "var(--color-foreground)",
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            {TAX_2026.b2b.ryczaltRates.map((rate) => (
              <option key={rate} value={rate}>
                {Math.round(rate * 100)}%
              </option>
            ))}
          </select>
          <p
            style={{
              fontSize: "0.7rem",
              color: "var(--color-muted-foreground)",
              marginTop: "0.5rem",
              fontStyle: "italic",
            }}
          >
            Your actual ryczałt rate depends on the type of services and PKWiU.
          </p>
        </div>

        {/* ZUS profile */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              display: "block",
              fontSize: "0.75rem",
              fontWeight: 500,
              marginBottom: "0.75rem",
              color: "var(--color-muted-foreground)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            ZUS
          </label>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {(["ulgaNaStart", "preferential", "full"] as B2BZUSProfile[]).map(
              (zus) => (
                <label
                  key={zus}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: "1px solid var(--color-border)",
                    cursor: "pointer",
                    background:
                      profile.b2b.zusProfile === zus
                        ? "rgba(59,130,246,0.1)"
                        : "transparent",
                  }}
                >
                  <input
                    type="radio"
                    name="zus"
                    value={zus}
                    checked={profile.b2b.zusProfile === zus}
                    onChange={(e) => handleZUSChange(e.target.value as B2BZUSProfile)}
                    style={{ marginRight: "0.75rem", cursor: "pointer" }}
                  />
                  <span
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--color-foreground)",
                    }}
                  >
                    {TAX_2026.b2b.zus[zus].name}
                  </span>
                </label>
              )
            )}
          </div>
        </div>

        {/* Sickness insurance (only for preferential/full) */}
        {(profile.b2b.zusProfile === "preferential" ||
          profile.b2b.zusProfile === "full") && (
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid var(--color-border)",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={profile.b2b.sicknesInsurance}
                onChange={(e) => handleSicknessChange(e.target.checked)}
                style={{ marginRight: "0.75rem", cursor: "pointer" }}
              />
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "var(--color-foreground)",
                }}
              >
                Voluntary sickness insurance
              </span>
            </label>
          </div>
        )}

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "var(--color-border)",
            margin: "1.5rem 0",
          }}
        />

        {/* Footer */}
        <div
          style={{
            fontSize: "0.7rem",
            color: "var(--color-muted-foreground)",
            marginBottom: "1rem",
            fontStyle: "italic",
          }}
        >
          2026 rates · Official sources
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={handleReset}
            style={{
              flex: 1,
              padding: "0.75rem",
              borderRadius: "0.5rem",
              border: "1px solid var(--color-border)",
              background: "transparent",
              color: "var(--color-muted-foreground)",
              fontSize: "0.875rem",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-muted)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            Reset
          </button>

          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "0.75rem",
              borderRadius: "0.5rem",
              border: "none",
              background: "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)",
              color: "#fff",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
