import type { CSSProperties } from "react"
import type { TaxProfile } from "../../config/tax"
import type { Translation } from "../../i18n/translations"
import { SYM } from "../../lib/formatting"
import { fromMonthlyAmount } from "../../lib/salaryPeriod"
import type { Currency, InputType, SalaryInputPeriod } from "../../types"

export interface QuickScenario {
  label: string
  amount: number
  currency: Currency
  type: InputType
  period: SalaryInputPeriod
}

interface TargetPanelProps {
  rawAmount: string
  amount: number
  currency: Currency
  inputType: InputType
  period: SalaryInputPeriod
  sliderValue: number
  profile: TaxProfile
  quickScenarios: QuickScenario[]
  t: Translation
  onAmountChange: (value: string) => void
  onSliderChange: (value: number) => void
  onCurrencyChange: (currency: Currency) => void
  onInputTypeChange: (type: InputType) => void
  onPeriodChange: (period: SalaryInputPeriod) => void
  onQuickScenario: (scenario: QuickScenario) => void
  onEditProfile: () => void
}

function formatEditableAmount(value: string) {
  if (!value) return ""
  const [whole = "", decimal] = value.split(".")
  const formattedWhole = Number(whole || 0).toLocaleString("en-US")
  return decimal === undefined ? formattedWhole : `${formattedWhole}.${decimal}`
}

export function TargetPanel(props: TargetPanelProps) {
  const monthlyMin = 1_000
  const monthlyMax = props.currency === "PLN" ? 50_000 : 10_000
  const sliderMin = fromMonthlyAmount(monthlyMin, props.period)
  const sliderMax = fromMonthlyAmount(monthlyMax, props.period)
  const sliderStep =
    props.period === "hour" ? 1 : props.period === "year" ? 1_200 : 100
  const progress =
    ((Math.min(Math.max(props.sliderValue, sliderMin), sliderMax) - sliderMin) /
      (sliderMax - sliderMin)) *
    100
  const zusLabel = {
    ulgaNaStart: props.t.start,
    preferential: props.t.preferential,
    full: props.t.fullZus,
  }[props.profile.b2b.zusProfile]
  const rateLabel = `${Number((props.profile.b2b.ryczaltRate * 100).toFixed(1))}% ${props.t.ryczaltTerm}`
  const uopLabel =
    props.profile.uop.kupType === "standard"
      ? props.t.standardUop
      : props.t.commuterUop

  const setAmount = (value: string) => {
    const normalized = value.replace(/,/g, "").replace(/[^\d.]/g, "")
    const [whole = "", ...decimals] = normalized.split(".")
    const next = decimals.length
      ? `${whole}.${decimals.join("").slice(0, 2)}`
      : whole
    props.onAmountChange(next)
    props.onSliderChange(Number(next) || 0)
  }

  return (
    <section
      className="flex min-w-0 flex-col gap-6"
      aria-label={props.t.targetQuestion}
    >
      <div
        role="radiogroup"
        aria-label={props.t.targetQuestion}
        className="grid grid-cols-2 gap-2"
      >
        {([
          ["net", props.t.desiredNet, props.t.desiredNetDesc],
          ["gross", props.t.offeredGross, props.t.offeredGrossDesc],
        ] as const).map(([value, label, description]) => {
          const selected = props.inputType === value
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => props.onInputTypeChange(value)}
              className={`min-w-0 rounded-[10px] px-3 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                selected ? "bg-[#e6f2ff]" : "hover:bg-white/70"
              }`}
            >
              <span className="block truncate text-[15px] font-semibold text-text-primary">
                {label}
              </span>
              <span className="mt-0.5 block truncate text-[11px] font-normal text-text-secondary">
                {description}
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-[72px] min-w-0 flex-1 items-center rounded-[12px] border border-border-subtle bg-white px-3.5">
          {SYM[props.currency] && (
            <span
              className="font-display text-[38px] font-bold leading-none text-text-primary"
              aria-hidden="true"
            >
              {SYM[props.currency]}
            </span>
          )}
          <label htmlFor="target-amount" className="sr-only">
            {props.t.amount}
          </label>
          <input
            id="target-amount"
            type="text"
            inputMode="decimal"
            value={formatEditableAmount(props.rawAmount)}
            onChange={(event) => setAmount(event.target.value)}
            className="min-w-0 flex-1 bg-transparent font-display text-[38px] font-bold leading-none tabular-nums text-text-primary outline-none"
          />
        </div>

        <div className="flex shrink-0 items-center gap-3 text-[13px] font-medium text-text-secondary">
          <label className="relative">
            <span className="sr-only">{props.t.currency}</span>
            <select
              value={props.currency}
              onChange={(event) =>
                props.onCurrencyChange(event.target.value as Currency)
              }
              className="appearance-none bg-transparent py-2 pl-0 pr-3.5 outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="PLN">PLN</option>
            </select>
            <span
              className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[10px]"
              aria-hidden="true"
            >
              ⌄
            </span>
          </label>
          <label className="relative">
            <span className="sr-only">
              {props.t.salaryPeriod[props.period]}
            </span>
            <select
              value={props.period}
              onChange={(event) =>
                props.onPeriodChange(event.target.value as SalaryInputPeriod)
              }
              className="max-w-[70px] appearance-none bg-transparent py-2 pl-0 pr-3.5 outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="month">{props.t.salaryPeriod.month}</option>
              <option value="year">{props.t.salaryPeriod.year}</option>
              <option value="hour">{props.t.salaryPeriod.hour}</option>
            </select>
            <span
              className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[10px]"
              aria-hidden="true"
            >
              ⌄
            </span>
          </label>
        </div>
      </div>

      <input
        id="quick-amount"
        type="range"
        min={sliderMin}
        max={sliderMax}
        step={sliderStep}
        value={Math.min(Math.max(props.sliderValue, sliderMin), sliderMax)}
        onChange={(event) => {
          const value = Number(event.target.value)
          props.onSliderChange(value)
          props.onAmountChange(String(value))
        }}
        aria-label={props.t.quickAmount}
        className="range-input w-full focus-visible:outline-2 focus-visible:outline-primary"
        style={{ "--range-progress": `${progress}%` } as CSSProperties}
      />

      <div>
        <p className="mb-2 text-xs font-medium leading-[18px] text-text-secondary">
          {props.t.quickScenarios}
        </p>
        <div className="grid grid-cols-[0.75fr_0.75fr_1.3fr_1.1fr] gap-1.5">
          {props.quickScenarios.map((scenario) => {
            const selected =
              props.amount === scenario.amount &&
              props.currency === scenario.currency &&
              props.inputType === scenario.type &&
              props.period === scenario.period
            return (
              <button
                key={scenario.label}
                type="button"
                onClick={() => props.onQuickScenario(scenario)}
                className={`min-h-10 min-w-0 whitespace-nowrap rounded-[10px] border px-1 text-[10px] font-normal transition-colors focus-visible:outline-2 focus-visible:outline-primary min-[360px]:text-[11px] desktop:text-xs ${
                  selected
                    ? "border-[#bdd7f5] bg-[#eef6ff] text-text-primary"
                    : "border-border-subtle bg-white text-text-secondary hover:border-[#aeb9d5]"
                }`}
              >
                {scenario.label}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-text-primary tablet:text-[15px]">
            {props.t.taxProfile}
          </h3>
          <button
            type="button"
            onClick={props.onEditProfile}
            className="shrink-0 border-b border-dashed border-current text-xs font-normal leading-4 text-text-primary hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {props.t.editTaxProfile} →
          </button>
        </div>
        <p className="mt-2 whitespace-nowrap text-[10px] leading-4 text-text-secondary min-[360px]:text-[11px] desktop:text-xs">
          {rateLabel} · {zusLabel} · {uopLabel}
          {props.profile.uop.ppkEnabled ? " · PPK" : ""}
        </p>
      </div>
    </section>
  )
}
