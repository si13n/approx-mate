import type { CSSProperties } from "react"
import type { TaxProfile } from "../../config/tax"
import type { Translation } from "../../i18n/translations"
import { SYM } from "../../lib/formatting"
import type { Currency, InputType } from "../../types"
import { SegmentedControl } from "../ui/SegmentedControl"

export interface QuickScenario {
  label: string
  amount: number
  currency: Currency
  type: InputType
}

interface TargetPanelProps {
  rawAmount: string
  amount: number
  currency: Currency
  inputType: InputType
  sliderValue: number
  profile: TaxProfile
  quickScenarios: QuickScenario[]
  t: Translation
  onAmountChange: (value: string) => void
  onSliderChange: (value: number) => void
  onCurrencyChange: (currency: Currency) => void
  onInputTypeChange: (type: InputType) => void
  onQuickScenario: (scenario: QuickScenario) => void
  onEditProfile: () => void
}

export function TargetPanel(props: TargetPanelProps) {
  const sliderMax = props.currency === "PLN" ? 50000 : 10000
  const sliderMin = 1000
  const progress =
    ((Math.min(Math.max(props.sliderValue, sliderMin), sliderMax) - sliderMin) /
      (sliderMax - sliderMin)) *
    100
  const zusLabel = {
    ulgaNaStart: props.t.start,
    preferential: props.t.preferential,
    full: props.t.fullZus,
  }[props.profile.b2b.zusProfile]
  const rateLabel = `${Math.round(props.profile.b2b.ryczaltRate * 100)}% ${props.t.ryczaltTerm}`
  const uopLabel =
    props.profile.uop.kupType === "standard"
      ? props.t.standardUop
      : props.t.commuterUop

  const setAmount = (value: string) => {
    props.onAmountChange(value)
    props.onSliderChange(Number(value) || 0)
  }
  const setSlider = (value: number) => {
    props.onSliderChange(value)
    props.onAmountChange(String(value))
  }

  return (
    <section
      className="flex flex-col gap-2 rounded-panel border border-border bg-surface p-4 desktop:p-6"
      aria-labelledby="target-title"
    >
      <div className="hidden desktop:block">
        <p className="text-xs font-semibold tracking-[0.08em] text-content-secondary">
          {props.t.yourTarget}
        </p>
        <h2
          id="target-title"
          className="mt-2 font-display text-[22px] font-semibold"
        >
          {props.t.targetQuestion}
        </h2>
      </div>

      <SegmentedControl
        value={props.inputType}
        onChange={props.onInputTypeChange}
        ariaLabel={props.t.targetQuestion}
        comfortable
        options={[
          {
            value: "net",
            label: props.t.desiredNet,
            description: props.t.desiredNetDesc,
          },
          {
            value: "gross",
            label: props.t.offeredGross,
            description: props.t.offeredGrossDesc,
          },
        ]}
      />

      <div className="flex min-h-[70px] items-center gap-2 rounded-[14px] border border-border-strong bg-surface-subtle px-3 tablet:min-h-[86px] tablet:px-[18px]">
        <label htmlFor="target-amount" className="sr-only">
          {props.t.amount}
        </label>
        {SYM[props.currency] && (
          <span
            className="font-display text-2xl font-medium text-content-secondary"
            aria-hidden="true"
          >
            {SYM[props.currency]}
          </span>
        )}
        <input
          id="target-amount"
          type="number"
          min="0"
          inputMode="decimal"
          value={props.rawAmount}
          onChange={(event) => setAmount(event.target.value)}
          className="min-w-0 flex-1 bg-transparent font-display text-[31px] font-bold tabular-nums outline-none tablet:text-4xl"
        />
        <label htmlFor="target-currency" className="sr-only">
          {props.t.currency}
        </label>
        <select
          id="target-currency"
          value={props.currency}
          onChange={(event) =>
            props.onCurrencyChange(event.target.value as Currency)
          }
          className="min-h-8 rounded-full border-0 bg-primary-subtle px-3 text-xs font-semibold text-action outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="PLN">PLN</option>
        </select>
      </div>

      <div className="min-h-[51px]">
        <div className="flex items-center justify-between text-xs font-medium text-content-secondary">
          <label htmlFor="quick-amount">{props.t.quickAmount}</label>
          <span className="font-semibold text-action">
            {SYM[props.currency]}
            {Math.round(props.sliderValue / 100) / 10}k
          </span>
        </div>
        <input
          id="quick-amount"
          type="range"
          min={sliderMin}
          max={sliderMax}
          step="100"
          value={Math.min(Math.max(props.sliderValue, sliderMin), sliderMax)}
          onChange={(event) => setSlider(Number(event.target.value))}
          className="range-input mt-[7px] w-full focus-visible:outline-2 focus-visible:outline-primary"
          style={{ "--range-progress": `${progress}%` } as CSSProperties}
        />
      </div>

      <div className="hidden tablet:block">
        <p className="mb-2 text-[13px] font-semibold leading-[18px] text-content-secondary">
          {props.t.quickScenarios}
        </p>
        <div className="flex flex-wrap gap-2">
          {props.quickScenarios.map((scenario) => {
            const selected =
              props.amount === scenario.amount &&
              props.currency === scenario.currency &&
              props.inputType === scenario.type
            return (
              <button
                key={scenario.label}
                type="button"
                onClick={() => props.onQuickScenario(scenario)}
                className={`min-h-[30px] rounded-full border px-2.5 text-[13px] font-semibold focus-visible:outline-2 focus-visible:outline-primary ${
                  selected
                    ? "border-primary-border bg-primary-subtle text-action"
                    : "border-border bg-surface text-content-secondary hover:border-primary"
                }`}
              >
                {scenario.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="border-t border-border pt-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold tablet:text-[15px]">
            {props.t.taxProfile}
          </h3>
          <button
            type="button"
            onClick={props.onEditProfile}
            className="shrink-0 border-b border-dashed border-current text-xs font-semibold leading-5 text-action hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {props.t.editTaxProfile}
          </button>
        </div>
        <div className="mt-2 text-xs leading-[18px] text-content-secondary tablet:hidden">
          <p>
            B2B · {rateLabel} · {zusLabel}
          </p>
          <p>
            UoP · {uopLabel}
            {props.profile.uop.ppkEnabled ? " · PPK" : ""}
          </p>
        </div>
        <div className="mt-2 hidden text-[13px] leading-4 text-content-secondary tablet:block">
          {rateLabel} · {zusLabel} · {uopLabel}
          {props.profile.uop.ppkEnabled ? " · PPK" : ""}
        </div>
      </div>
    </section>
  )
}
