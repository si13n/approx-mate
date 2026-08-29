import type { Translation } from "../../i18n/translations"
import type { Currency, InputType } from "../../types"
import { IconButton } from "../ui/IconButton"
import { SegmentedControl } from "../ui/SegmentedControl"
import type { ContractType, Offer } from "./compareCalculations"

interface OfferEditorCardProps {
  offer: Offer
  index: number
  canRemove: boolean
  t: Translation
  onRemove: () => void
  onChange: <K extends keyof Offer>(field: K, value: Offer[K]) => void
}

const tones = [
  {
    card: "border-primary bg-primary-subtle",
    dot: "bg-primary",
    control: "primary" as const,
  },
  {
    card: "border-accent bg-accent-subtle",
    dot: "bg-accent",
    control: "accent" as const,
  },
  {
    card: "border-tertiary bg-tertiary-subtle",
    dot: "bg-tertiary",
    control: "primary" as const,
  },
]

export function OfferEditorCard({
  offer,
  index,
  canRemove,
  t,
  onRemove,
  onChange,
}: OfferEditorCardProps) {
  const tone = tones[index % tones.length]
  const offerName = `${t.offerLabel} ${offer.name}`
  return (
    <article
      className={`flex min-w-0 flex-col gap-2.5 rounded-card border-[1.2px] p-3.5 tablet:gap-3 tablet:p-4 ${tone.card}`}
    >
      <div className="flex min-h-11 items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`size-2.5 rounded-full ${tone.dot}`}
            aria-hidden="true"
          />
          <h3 className="text-sm font-semibold">{offerName}</h3>
        </div>
        <IconButton
          label={`${t.removeOffer} ${offerName}`}
          onClick={onRemove}
          disabled={!canRemove}
          title={canRemove ? `${t.removeOffer} ${offerName}` : t.upToThree}
          className="text-xl"
        >
          ×
        </IconButton>
      </div>
      <div className="flex min-h-[54px] items-center rounded-xl border border-border-strong bg-surface-subtle px-3">
        <label htmlFor={`offer-${offer.id}-amount`} className="sr-only">
          {t.amount}
        </label>
        <input
          id={`offer-${offer.id}-amount`}
          type="number"
          min="0"
          inputMode="decimal"
          value={offer.amount || ""}
          onChange={(event) =>
            onChange("amount", Math.max(0, Number(event.target.value)))
          }
          className="min-w-0 flex-1 bg-transparent font-display text-2xl font-semibold tabular-nums outline-none"
        />
        <label htmlFor={`offer-${offer.id}-currency`} className="sr-only">
          {t.currency}
        </label>
        <select
          id={`offer-${offer.id}-currency`}
          value={offer.currency}
          onChange={(event) =>
            onChange("currency", event.target.value as Currency)
          }
          className="min-h-11 border-0 bg-transparent text-xs font-medium text-content-secondary outline-none"
        >
          <option value="PLN">PLN / {t.monthShort}</option>
          <option value="USD">USD / {t.monthShort}</option>
          <option value="EUR">EUR / {t.monthShort}</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2 tablet:hidden">
        <select
          aria-label={t.contractType}
          value={offer.contractType}
          onChange={(event) =>
            onChange("contractType", event.target.value as ContractType)
          }
          className="min-h-11 rounded-[10px] border-0 bg-surface px-3 text-center text-xs font-semibold text-action"
        >
          <option>B2B</option>
          <option>UoP</option>
        </select>
        <select
          aria-label={t.amount}
          value={offer.inputType}
          onChange={(event) =>
            onChange("inputType", event.target.value as InputType)
          }
          className="min-h-11 rounded-[10px] border-0 bg-surface px-3 text-center text-xs font-semibold text-action"
        >
          <option value="gross">{t.grossLabel}</option>
          <option value="net">{t.netLabel}</option>
        </select>
      </div>
      <div className="hidden grid-cols-2 gap-2 tablet:grid">
        <SegmentedControl<ContractType>
          compact
          tone={tone.control}
          ariaLabel={t.contractType}
          value={offer.contractType}
          onChange={(value) => onChange("contractType", value)}
          options={[
            { value: "B2B", label: "B2B" },
            { value: "UoP", label: "UoP" },
          ]}
        />
        <SegmentedControl<InputType>
          compact
          tone={tone.control}
          ariaLabel={t.amount}
          value={offer.inputType}
          onChange={(value) => onChange("inputType", value)}
          options={[
            { value: "gross", label: t.grossLabel },
            { value: "net", label: t.netLabel },
          ]}
        />
      </div>
    </article>
  )
}
