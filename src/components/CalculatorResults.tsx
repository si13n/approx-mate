import { Currency, InputType } from "../types";
import { ResultCard } from "./ResultCard";
import { CompareSection } from "./CompareSection";
import { BreakdownSection } from "./BreakdownSection";
import { fmt, fromPLN } from "../lib/formatting";

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

  const primaryPLN = props.inputType === "net" ? props.results.b2bGrossPLN : props.results.b2bNetPLN;
  const decisionText = `To take home ${fmt(fromPLN(primaryPLN, props.currency), props.currency)} / month`;

  return (
    <div className="flex flex-col gap-6">
      {/* Decision header */}
      <div>
        <span className="text-xs font-semibold uppercase" style={{ color: "var(--color-muted-foreground)" }}>
          Your decision
        </span>
        <h2 className="text-2xl font-bold mt-1" style={{ fontFamily: "var(--font-display)" }}>
          {decisionText}
        </h2>
      </div>

      {/* Result cards — responsive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ResultCard
          label={props.inputType === "gross" ? props.t.ifB2B : "B2B"}
          grossPLN={props.results.b2bGrossPLN}
          netPLN={props.results.b2bNetPLN}
          currency={props.currency}
          inputType={props.inputType}
          hoursPerMonth={props.hoursPerMonth}
          isB2B={true}
          badge="Higher cash"
          badgeColor="blue"
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
          badge="More protection"
          badgeColor="teal"
          t={props.t}
        />
      </div>

      {/* Compare Section */}
      <CompareSection onCompareClick={props.onCompareClick} />

      {/* Recruiter message */}
      {props.recruiterMessage && (
        <div
          className="rounded-xl p-5 flex flex-col gap-3"
          style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: "var(--color-muted-foreground)" }}>
              Message for recruiter
            </span>
            <button
              onClick={props.onCopyMessage}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: props.copied ? "#DBEAFE" : "var(--color-muted)",
                color: props.copied ? "#2563EB" : "var(--color-muted-foreground)",
                border: "1px solid var(--color-border)",
                cursor: "pointer",
              }}
            >
              {props.copied ? "Copied!" : "Copy message"}
            </button>
          </div>
          <p className="text-sm" style={{ color: "var(--color-foreground)", lineHeight: "1.65" }}>
            {props.recruiterMessage}
          </p>
        </div>
      )}

      {/* Breakdown Section */}
      <BreakdownSection onViewBreakdown={() => {}} />
    </div>
  );
}
