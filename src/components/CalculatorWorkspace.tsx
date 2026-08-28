import { Currency, InputType } from "../types";
import { CalculatorInputPanel } from "./CalculatorInputPanel";
import { CalculatorResults } from "./CalculatorResults";
import { HeroSection } from "./HeroSection";

interface CalculatorWorkspaceProps {
  // InputPanel props
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
  b2bLabel?: string;
  uopLabel?: string;
  // Results props
  results: {
    b2bGrossPLN: number;
    b2bNetPLN: number;
    uopGrossPLN: number;
    uopNetPLN: number;
  } | null;
  hoursPerMonth: number;
  onCompareClick: () => void;
  recruiterMessage: string;
  onCopyMessage: () => void;
  copied: boolean;
  // Common
  t: Record<string, string>;
}

export function CalculatorWorkspace(props: CalculatorWorkspaceProps) {
  return (
    <>
      {/* Hero Section */}
      <HeroSection t={props.t} />

      {/* Two-column workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Panel */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="text-xs font-semibold uppercase" style={{ color: "var(--color-muted-foreground)" }}>
              YOUR TARGET
            </span>
            <h2 className="text-2xl font-bold mt-1" style={{ fontFamily: "var(--font-display)", lineHeight: "1.2" }}>
              What do you want to know?
            </h2>
          </div>

          <CalculatorInputPanel
            amount={props.amount}
            rawAmount={props.rawAmount}
            currency={props.currency}
            inputType={props.inputType}
            sliderValue={props.sliderValue}
            onAmountChange={props.onAmountChange}
            onSliderChange={props.onSliderChange}
            onCurrencyChange={props.onCurrencyChange}
            onInputTypeChange={props.onInputTypeChange}
            onOpenB2BSettings={props.onOpenB2BSettings}
            onOpenUoPSettings={props.onOpenUoPSettings}
            onQuickScenarioClick={props.onQuickScenarioClick}
            quickScenarios={props.quickScenarios}
            b2bLabel={props.b2bLabel}
            uopLabel={props.uopLabel}
            t={props.t}
          />
        </div>

        {/* Right: Results Panel */}
        <div>
          <CalculatorResults
            results={props.results}
            amount={props.amount}
            currency={props.currency}
            inputType={props.inputType}
            hoursPerMonth={props.hoursPerMonth}
            onCompareClick={props.onCompareClick}
            recruiterMessage={props.recruiterMessage}
            onCopyMessage={props.onCopyMessage}
            copied={props.copied}
            t={props.t}
          />
        </div>
      </div>
    </>
  );
}
