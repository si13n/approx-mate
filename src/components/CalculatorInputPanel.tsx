import { Currency, InputType } from "../types";
import { SYM } from "../lib/formatting";

interface CalculatorInputPanelProps {
  amount: number;
  rawAmount: string;
  currency: Currency;
  inputType: InputType;
  sliderValue: number;
  onAmountChange: (rawAmount: string) => void;
  onSliderChange: (value: number) => void;
  onCurrencyChange: (currency: Currency) => void;
  onInputTypeChange: (type: InputType) => void;
  onOpenB2BSettings: () => void;
  onOpenUoPSettings: () => void;
  onQuickScenarioClick?: (label: string) => void;
  quickScenarios: Array<{ label: string; amount: number; currency: Currency; type: InputType }>;
  t: Record<string, string>;
}

function InputModeToggle({ inputType, onInputTypeChange, t }: { inputType: InputType; onInputTypeChange: (type: InputType) => void; t: Record<string, string> }) {
  return (
    <div className="grid grid-cols-2 rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
      {(["net", "gross"] as InputType[]).map((v, i) => (
        <button
          key={v}
          onClick={() => onInputTypeChange(v)}
          className="py-3 flex flex-col items-center gap-0.5 transition-all duration-200"
          style={{
            background: inputType === v ? "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)" : "var(--color-muted)",
            color: inputType === v ? "#fff" : "var(--color-muted-foreground)",
            borderLeft: i > 0 ? "1px solid var(--color-border)" : "none",
          }}
        >
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 600 }}>
            {v === "net" ? t.net : t.gross}
          </span>
          <span style={{ fontSize: "0.6875rem", opacity: inputType === v ? 0.8 : 0.6 }}>
            {v === "net" ? t.netDesc : t.grossDesc}
          </span>
        </button>
      ))}
    </div>
  );
}

function AmountInput({ rawAmount, onAmountChange, currency }: { rawAmount: string; onAmountChange: (val: string) => void; currency: Currency }) {
  const currSymbol = SYM[currency];
  const showPLNLabel = currency === "PLN";

  return (
    <div>
      <div className="relative">
        {!showPLNLabel && (
          <span
            className="absolute left-4 top-1/2 -translate-y-1/2 select-none"
            style={{ fontSize: "1.5rem", fontWeight: 500, color: "var(--color-muted-foreground)", fontFamily: "var(--font-display)" }}
          >
            {currSymbol}
          </span>
        )}
        <input
          type="number"
          value={rawAmount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="0"
          className="w-full rounded-xl outline-none transition-all tabular-nums"
          style={{
            paddingLeft: showPLNLabel ? "1.125rem" : "2.75rem",
            paddingRight: showPLNLabel ? "4rem" : "1.125rem",
            paddingTop: "0.875rem",
            paddingBottom: "0.875rem",
            fontSize: "2rem",
            fontWeight: 700,
            fontFamily: "var(--font-display)",
            letterSpacing: "-0.03em",
            background: "var(--color-muted)",
            border: "2px solid transparent",
            color: "var(--color-foreground)",
            textAlign: "center",
          }}
          onFocus={(e) => { e.target.style.borderColor = "#3B82F6"; e.target.style.background = "#fff"; }}
          onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.background = "var(--color-muted)"; }}
        />
        {showPLNLabel && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base font-semibold select-none" style={{ color: "var(--color-muted-foreground)" }}>
            PLN
          </span>
        )}
      </div>
    </div>
  );
}

function CurrencySwitcher({ currency, onCurrencyChange }: { currency: Currency; onCurrencyChange: (c: Currency) => void }) {
  return (
    <div className="grid grid-cols-3 rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
      {(["USD", "EUR", "PLN"] as Currency[]).map((c, i) => (
        <button
          key={c}
          onClick={() => onCurrencyChange(c)}
          className="py-2 text-sm font-semibold transition-all duration-150"
          style={{
            background: currency === c ? "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)" : "var(--color-muted)",
            color: currency === c ? "#fff" : "var(--color-muted-foreground)",
            borderLeft: i > 0 ? "1px solid var(--color-border)" : "none",
            fontFamily: "var(--font-display)",
          }}
        >
          {c === "USD" ? "$ USD" : c === "EUR" ? "€ EUR" : "PLN"}
        </button>
      ))}
    </div>
  );
}

function QuickAmountSlider({ sliderValue, sliderMax, onSliderChange }: { sliderValue: number; sliderMax: number; onSliderChange: (val: number) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <input
        type="range"
        min={1000}
        max={sliderMax}
        step={100}
        value={Math.min(sliderValue, sliderMax)}
        onChange={(e) => onSliderChange(Number(e.target.value))}
        className="w-full accent-blue-500"
        style={{ height: 4 }}
      />
    </div>
  );
}

function QuickScenarios({
  scenarios,
  onSelectScenario,
  t,
}: {
  scenarios: Array<{ label: string; amount: number; currency: Currency; type: InputType }>;
  onSelectScenario: (scenario: typeof scenarios[0]) => void;
  t: Record<string, string>;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "var(--color-muted-foreground)" }}>
        {t.quickScenarios}
      </p>
      <div className="flex flex-wrap gap-2">
        {scenarios.map((s) => (
          <button
            key={s.label}
            onClick={() => onSelectScenario(s)}
            className="px-3.5 py-2 rounded-full text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "var(--color-card)",
              border: "1px solid var(--color-border)",
              color: "var(--color-foreground)",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              fontFamily: "var(--font-display)",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#3B82F6"; (e.currentTarget as HTMLElement).style.color = "#3B82F6"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)"; (e.currentTarget as HTMLElement).style.color = "var(--color-foreground)"; }}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CalculatorInputPanel(props: CalculatorInputPanelProps) {
  const sliderMax = props.currency === "PLN" ? 50000 : 10000;

  const handleAmountChange = (rawAmount: string) => {
    props.onAmountChange(rawAmount);
    props.onSliderChange(Number(rawAmount) || 0);
  };

  const handleSliderChange = (value: number) => {
    props.onSliderChange(value);
    props.onAmountChange(String(value));
  };

  const handleQuickScenario = (scenario: typeof props.quickScenarios[0]) => {
    props.onAmountChange(String(scenario.amount));
    props.onSliderChange(scenario.amount);
    props.onCurrencyChange(scenario.currency);
    props.onInputTypeChange(scenario.type);
    props.onQuickScenarioClick?.(scenario.label);
  };

  return (
    <div
      className="rounded-2xl p-3 flex flex-col gap-3"
      style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
    >
      <InputModeToggle inputType={props.inputType} onInputTypeChange={props.onInputTypeChange} t={props.t} />

      <AmountInput rawAmount={props.rawAmount} onAmountChange={handleAmountChange} currency={props.currency} />

      <CurrencySwitcher currency={props.currency} onCurrencyChange={props.onCurrencyChange} />

      <QuickAmountSlider sliderValue={props.sliderValue} sliderMax={sliderMax} onSliderChange={handleSliderChange} />

      <QuickScenarios scenarios={props.quickScenarios} onSelectScenario={handleQuickScenario} t={props.t} />
    </div>
  );
}
