import { Currency, InputType } from "../types";
import { ResultCard } from "./ResultCard";

interface CalculatorResultsProps {
  results: {
    b2bGrossPLN: number;
    b2bNetPLN: number;
    uopGrossPLN: number;
    uopNetPLN: number;
  } | null;
  amount: number;
  currency: Currency;
  inputType: InputType;
  hoursPerMonth: number;
  onCompareClick: () => void;
  recruiterMessage: string;
  onCopyMessage: () => void;
  copied: boolean;
  t: Record<string, string>;
}

export function CalculatorResults(props: CalculatorResultsProps) {
  if (!props.results || props.amount <= 0) {
    return null;
  }

  return (
    <>
      {/* Two cards — responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ResultCard
          label={props.inputType === "gross" ? props.t.ifB2B : "B2B"}
          grossPLN={props.results.b2bGrossPLN}
          netPLN={props.results.b2bNetPLN}
          currency={props.currency}
          inputType={props.inputType}
          hoursPerMonth={props.hoursPerMonth}
          isB2B={true}
          t={props.t}
        />
        <ResultCard
          label={props.inputType === "gross" ? props.t.ifUoP : "UoP"}
          grossPLN={props.results.uopGrossPLN}
          netPLN={props.results.uopNetPLN}
          currency={props.currency}
          inputType={props.inputType}
          hoursPerMonth={props.hoursPerMonth}
          isB2B={false}
          t={props.t}
        />
      </div>

      {/* Compare Offers CTA */}
      <button
        onClick={props.onCompareClick}
        className="w-full py-3 rounded-xl font-semibold transition-all"
        style={{
          background: "linear-gradient(135deg, #FF9500 0%, #FB923C 100%)",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-display)",
        }}
      >
        COMPARE! 🔄
      </button>

      {/* Recruiter message */}
      {props.recruiterMessage && (
        <div
          className="rounded-2xl p-5 flex flex-col gap-3"
          style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-muted-foreground)" }}>
              {props.t.recruiterTitle}
            </span>
            <button
              onClick={props.onCopyMessage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: props.copied ? "#DBEAFE" : "var(--color-muted)",
                color: props.copied ? "#2563EB" : "var(--color-muted-foreground)",
                border: "1px solid var(--color-border)",
                cursor: "pointer",
              }}
            >
              {props.copied ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {props.t.recruiterCopied}
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <rect x="4" y="1" width="7" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M1 4.5V10a1 1 0 001 1h5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  {props.t.recruiterCopy}
                </>
              )}
            </button>
          </div>
          <p className="text-sm" style={{ color: "var(--color-foreground)", lineHeight: "1.65" }}>
            {props.recruiterMessage}
          </p>
        </div>
      )}
    </>
  );
}
