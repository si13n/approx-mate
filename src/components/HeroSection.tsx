interface HeroSectionProps {
  t: Record<string, string>;
}

export function HeroSection({ t }: HeroSectionProps) {
  return (
    <div className="mb-4">
      <h1 className="text-4xl font-bold mb-1" style={{ fontFamily: "var(--font-display)", lineHeight: "1.2" }}>
        Know what an offer is really worth.
      </h1>
      <p className="text-sm" style={{ color: "var(--color-muted-foreground)", lineHeight: "1.5" }}>
        Poland 2026 · Compare B2B and UoP, work backwards from your target take-home, and negotiate with confidence.
      </p>
    </div>
  );
}
