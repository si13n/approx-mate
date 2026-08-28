import { Currency, InputType } from "../types";
import { CalculatorInputPanel } from "./CalculatorInputPanel";
import { CalculatorResults } from "./CalculatorResults";

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Input Panel */}
      <div>
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
  );
}
