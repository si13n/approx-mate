interface TaxProfilePillsProps {
  b2bLabel: string;
  uopLabel: string;
  onEdit: () => void;
}

export function TaxProfilePills({ b2bLabel, uopLabel, onEdit }: TaxProfilePillsProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>
          Tax profile
        </span>
        <button
          onClick={onEdit}
          className="text-xs font-semibold"
          style={{
            color: "#3B82F6",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Edit
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <span
          className="text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{
            background: "rgba(59,130,246,0.1)",
            color: "#2563EB",
          }}
        >
          {b2bLabel}
        </span>
        <span
          className="text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{
            background: "rgba(59,130,246,0.1)",
            color: "#2563EB",
          }}
        >
          Full ZUS
        </span>
        <span
          className="text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{
            background: "rgba(6,182,212,0.1)",
            color: "#0891B2",
          }}
        >
          {uopLabel}
        </span>
      </div>
      <p className="text-xs mt-2" style={{ color: "var(--color-muted-foreground)" }}>
        Advanced tax details stay out of the main flow until you need them.
      </p>
    </div>
  );
}
