interface CompareSectionProps {
  onCompareClick: () => void;
}

export function CompareSection({ onCompareClick }: CompareSectionProps) {
  return (
    <div
      className="rounded-xl p-6 flex items-center justify-between"
      style={{
        background: "#2D3748",
        color: "#fff",
      }}
    >
      <div>
        <h3 className="font-semibold mb-1">Compare real offers</h3>
        <p className="text-sm" style={{ opacity: 0.8 }}>
          Add 2–3 offers and rank them by cash, total value, and effective hourly rate.
        </p>
      </div>
      <button
        onClick={onCompareClick}
        className="px-4 py-2 rounded-lg font-semibold whitespace-nowrap ml-4"
        style={{
          background: "#fff",
          color: "#2D3748",
          border: "none",
          cursor: "pointer",
        }}
      >
        Compare offers →
      </button>
    </div>
  );
}
