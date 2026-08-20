import { TaxProfile, TAX_2026, UoPKUPType } from "../config/tax";
import { trackUoPKUPChanged, trackUoPPPKChanged, trackTaxProfileReset } from "../lib/analytics";

interface UoPSettingsModalProps {
  profile: TaxProfile;
  onUpdate: (profile: TaxProfile) => void;
  onReset: () => void;
  onClose: () => void;
}

export function UoPSettingsModal({
  profile,
  onUpdate,
  onReset,
  onClose,
}: UoPSettingsModalProps) {
  const handleKUPChange = (kupType: UoPKUPType) => {
    onUpdate({
      ...profile,
      uop: { ...profile.uop, kupType },
    });
    trackUoPKUPChanged(kupType);
  };

  const handlePPKChange = (enabled: boolean) => {
    onUpdate({
      ...profile,
      uop: { ...profile.uop, ppkEnabled: enabled },
    });
    trackUoPPPKChanged(enabled);
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
          UoP settings
        </h2>

        {/* KUP */}
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
            Tax-deductible employee costs (KUP)
          </label>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {(["standard", "commuter"] as UoPKUPType[]).map((kupType) => (
              <label
                key={kupType}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid var(--color-border)",
                  cursor: "pointer",
                  background:
                    profile.uop.kupType === kupType
                      ? "rgba(59,130,246,0.1)"
                      : "transparent",
                }}
              >
                <input
                  type="radio"
                  name="kup"
                  value={kupType}
                  checked={profile.uop.kupType === kupType}
                  onChange={(e) => handleKUPChange(e.target.value as UoPKUPType)}
                  style={{ marginRight: "0.75rem", cursor: "pointer" }}
                />
                <span
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--color-foreground)",
                  }}
                >
                  {kupType === "standard"
                    ? `Standard — ${TAX_2026.uop.kup.standard} PLN/month`
                    : `Commuter — ${TAX_2026.uop.kup.commuter} PLN/month`}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* PPK */}
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
              checked={profile.uop.ppkEnabled}
              onChange={(e) => handlePPKChange(e.target.checked)}
              style={{ marginRight: "0.75rem", cursor: "pointer" }}
            />
            <span
              style={{
                fontSize: "0.875rem",
                color: "var(--color-foreground)",
              }}
            >
              PPK (Pracowniczy Plan Kapitałowy)
            </span>
          </label>
          {profile.uop.ppkEnabled && (
            <p
              style={{
                fontSize: "0.7rem",
                color: "var(--color-muted-foreground)",
                marginTop: "0.5rem",
                marginLeft: "1.75rem",
                fontStyle: "italic",
              }}
            >
              Employee: 2% · Employer: 1.5%
            </p>
          )}
        </div>

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
