interface BreakdownSectionProps {
  onViewBreakdown: () => void;
}

export function BreakdownSection({ onViewBreakdown }: BreakdownSectionProps) {
  return (
    <div
      className="rounded-xl p-6"
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold mb-1">See why these numbers differ</h3>
          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
            Taxes, ZUS, health contribution, paid time off and employer/client cost.
          </p>
        </div>
        <button
          onClick={onViewBreakdown}
          className="text-sm font-semibold ml-4"
          style={{
            color: "#3B82F6",
            background: "none",
            border: "none",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          View breakdown →
        </button>
      </div>
    </div>
  );
}
