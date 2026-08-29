import { useMemo, useState, type ReactNode } from "react"
import type { TaxProfile } from "../../config/tax"
import type { Translation } from "../../i18n/translations"
import { fmt } from "../../lib/formatting"
import { Button } from "../ui/Button"
import { OfferEditorCard } from "./OfferEditorCard"
import {
  calculateOffer,
  summarizeOffers,
  type Offer,
  type OfferCalculation,
} from "./compareCalculations"

interface ComparisonPageProps {
  onBack: () => void
  rates: Record<string, number>
  profile: TaxProfile
  t: Translation
}

const initialOffers: Offer[] = [
  {
    id: "1",
    name: "A",
    amount: 25000,
    currency: "PLN",
    contractType: "B2B",
    inputType: "gross",
  },
  {
    id: "2",
    name: "B",
    amount: 22000,
    currency: "PLN",
    contractType: "UoP",
    inputType: "net",
  },
]

const offerDots = ["bg-primary", "bg-accent", "bg-tertiary"]

export function ComparisonPage({
  onBack,
  rates,
  profile,
  t,
}: ComparisonPageProps) {
  const [offers, setOffers] = useState<Offer[]>(initialOffers)
  const [shared, setShared] = useState(false)
  const hoursPerMonth = 160
  const calculations = useMemo(
    () =>
      offers.map((offer) =>
        calculateOffer(offer, profile, rates, hoursPerMonth),
      ),
    [offers, profile, rates],
  )
  const summary = useMemo(() => summarizeOffers(calculations), [calculations])
  const winner = summary?.winner
  const runnerUp = summary?.runnerUp
  const winnerId = winner?.id
  const monthlyDelta = summary?.monthlyDeltaPLN ?? 0
  const annualDelta = summary?.annualDeltaPLN ?? 0
  const percentageDelta = summary?.percentageDelta ?? 0

  const updateOffer = <K extends keyof Offer,>(
    id: string,
    field: K,
    value: Offer[K],
  ) => {
    setOffers((current) =>
      current.map((offer) =>
        offer.id === id ? { ...offer, [field]: value } : offer,
      ),
    )
  }

  const addOffer = () => {
    setOffers((current) => {
      if (current.length >= 3) return current
      const id = String(
        Math.max(...current.map((offer) => Number(offer.id) || 0)) + 1,
      )
      return [
        ...current,
        {
          id,
          name: String.fromCharCode(65 + current.length),
          amount: 20000,
          currency: "PLN",
          contractType: "B2B",
          inputType: "gross",
        },
      ]
    })
  }

  const removeOffer = (id: string) =>
    setOffers((current) =>
      current.length > 2 ? current.filter((offer) => offer.id !== id) : current,
    )

  const shareComparison = async () => {
    if (!winner) return
    const winnerName = `${t.offerLabel} ${winner.name}`
    const text = `${winnerName}: ${fmt(winner.netPLN, "PLN", 0)} ${t.netLabel.toLowerCase()}/${t.monthShort} · ${fmt(winner.annualNetPLN, "PLN", 0)} ${t.netYear.toLowerCase()}`
    try {
      if (navigator.share)
        await navigator.share({ title: t.compareOffers, text })
      else await navigator.clipboard.writeText(text)
      setShared(true)
      window.setTimeout(() => setShared(false), 2000)
    } catch {
      /* The user can cancel the native share sheet. */
    }
  }

  const rows: Array<{
    label: string
    value: (offer: OfferCalculation) => ReactNode
    highlight?: boolean
  }> = [
    { label: t.contractType, value: (offer) => offer.contractType },
    { label: t.grossMonthly, value: (offer) => fmt(offer.grossPLN, "PLN", 0) },
    {
      label: t.netMonthly,
      value: (offer) => fmt(offer.netPLN, "PLN", 0),
      highlight: true,
    },
    {
      label: t.netYear,
      value: (offer) => fmt(offer.annualNetPLN, "PLN", 0),
      highlight: true,
    },
    {
      label: t.hourlyNet,
      value: (offer) => fmt(offer.hourlyNetPLN, "PLN", 2),
      highlight: true,
    },
    {
      label: t.hourlyGross,
      value: (offer) => fmt(offer.hourlyGrossPLN, "PLN", 2),
    },
    { label: t.currency, value: (offer) => offer.currency },
    {
      label: t.notes,
      value: (offer) =>
        offer.contractType === "UoP" ? t.standardEmployment : t.noNotes,
    },
  ]

  return (
    <main className="flex min-w-0 flex-col gap-3 tablet:gap-4">
      <section aria-labelledby="compare-title">
        <button
          type="button"
          onClick={onBack}
          className="min-h-11 text-xs font-semibold text-content-secondary hover:text-content focus-visible:outline-2 focus-visible:outline-primary"
        >
          ← {t.backToCalculator}
        </button>
        <h1
          id="compare-title"
          className="font-display text-3xl font-bold tablet:text-[38px]"
        >
          {t.compareOffers}
        </h1>
        <p className="mt-1 text-sm text-content-secondary tablet:text-base">
          {t.compareSubtitle}
        </p>
      </section>

      <section
        className="rounded-panel border border-border bg-surface p-4 tablet:p-6"
        aria-labelledby="offer-editor-title"
      >
        <div className="mb-3 flex items-end justify-between gap-4 tablet:mb-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.06em] text-content-secondary">
              {t.yourOffers} · {offers.length} {t.of} 3
            </p>
            <h2
              id="offer-editor-title"
              className="mt-1 font-display text-xl font-semibold tablet:text-[22px]"
            >
              {t.editOffers}
            </h2>
          </div>
          <p className="hidden text-xs text-content-secondary tablet:block">
            {t.upToThree}
          </p>
        </div>
        <div className="grid gap-2 tablet:grid-cols-2 tablet:gap-3 desktop:grid-cols-3">
          {offers.map((offer, index) => (
            <OfferEditorCard
              key={offer.id}
              offer={offer}
              index={index}
              canRemove={offers.length > 2}
              t={t}
              onRemove={() => removeOffer(offer.id)}
              onChange={(field, value) => updateOffer(offer.id, field, value)}
            />
          ))}
          {offers.length < 3 && (
            <button
              type="button"
              onClick={addOffer}
              className="flex min-h-11 items-center justify-center gap-2 rounded-card border border-dashed border-border bg-surface px-4 text-[13px] font-semibold hover:border-primary focus-visible:outline-2 focus-visible:outline-primary tablet:min-h-[204px] tablet:flex-col"
            >
              <span
                className="flex size-11 items-center justify-center rounded-full bg-primary-subtle text-2xl text-action"
                aria-hidden="true"
              >
                +
              </span>
              <span>{t.addOffer}</span>
              <span className="hidden text-xs font-normal text-content-secondary tablet:block">
                {t.upToThree}
              </span>
            </button>
          )}
        </div>
      </section>

      {winner && runnerUp && (
        <section
          className="flex flex-col gap-2 rounded-[18px] bg-inverse p-[18px] text-content-inverse tablet:min-h-[132px] tablet:flex-row tablet:items-center tablet:justify-between tablet:rounded-[20px] tablet:p-6"
          aria-label={t.bestTakeHome}
          aria-live="polite"
        >
          <div className="flex items-center gap-4">
            <div
              className="hidden size-12 items-center justify-center rounded-xl bg-primary text-xs font-bold tablet:flex"
              aria-hidden="true"
            >
              {t.best}
            </div>
            <div>
              <p className="text-xs font-semibold text-primary-border">
                {t.bestTakeHome}
              </p>
              <h2 className="mt-1 font-display text-[23px] font-bold tablet:text-[26px]">
                {t.offerLabel} {winner.name} {t.aheadBy}{" "}
                {fmt(monthlyDelta, "PLN", 0)} {t.perMonth}
              </h2>
              <p className="mt-1 text-xs text-primary-border tablet:text-[13px]">
                {fmt(annualDelta, "PLN", 0)} {t.moreEachYear}
              </p>
            </div>
          </div>
          <div className="flex min-h-11 items-center justify-between gap-3 tablet:gap-4">
            <div className="rounded-[10px] bg-success-subtle px-3 py-2 text-xs font-semibold text-success tablet:text-base">
              +{Math.round(percentageDelta)}% {t.monthly}
            </div>
            <Button variant="secondary" onClick={shareComparison}>
              {shared ? t.shared : t.share} →
            </Button>
          </div>
        </section>
      )}

      <section
        className="overflow-hidden rounded-[20px] border border-border bg-surface tablet:rounded-panel"
        aria-labelledby="comparison-title"
      >
        <div className="p-4 tablet:flex tablet:items-center tablet:justify-between tablet:px-6 tablet:py-5">
          <div>
            <h2
              id="comparison-title"
              className="font-display text-xl font-semibold tablet:text-[22px]"
            >
              {t.detailedComparison}
            </h2>
            <p className="mt-1 text-xs text-content-secondary">
              {t.comparisonBasis}
            </p>
            <p className="mt-1 text-xs text-content-secondary tablet:hidden">
              {offers.length === 3 ? t.swipeOffers : ""}
            </p>
          </div>
          <span className="hidden rounded-full bg-page px-3 py-2 text-xs font-semibold text-content-secondary tablet:block">
            {t.polandRules}
          </span>
        </div>
        <div
          className="overflow-x-auto"
          tabIndex={0}
          aria-label={t.detailedComparison}
        >
          <table
            className="w-full border-collapse text-xs tablet:text-sm"
            style={{ minWidth: `${180 + calculations.length * 190}px` }}
          >
            <thead>
              <tr className="border-y border-border bg-page">
                <th className="w-[180px] px-3.5 py-3 text-left text-xs font-semibold text-content-secondary tablet:w-[31%] tablet:px-6">
                  {t.metric}
                </th>
                {calculations.map((offer, index) => (
                  <th
                    key={offer.id}
                    className="min-w-[190px] bg-surface px-3 py-3 text-center font-semibold"
                  >
                    <span className="inline-flex items-center gap-2">
                      <span
                        className={`size-2 rounded-full ${offerDots[index]}`}
                        aria-hidden="true"
                      />
                      {t.offerLabel} {offer.name}
                      {winnerId === offer.id && (
                        <span className="rounded-full bg-success-subtle px-2 py-1 text-[10px] text-success">
                          {t.best}
                        </span>
                      )}
                    </span>
                    <span className="mt-1 block text-[11px] font-normal text-content-secondary tablet:hidden">
                      {offer.contractType} ·{" "}
                      {offer.inputType === "gross" ? t.grossLabel : t.netLabel}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-border">
                  <th
                    scope="row"
                    className="bg-surface-subtle px-3.5 py-3 text-left text-xs font-medium text-content-secondary tablet:px-6"
                  >
                    {row.label}
                  </th>
                  {calculations.map((offer) => {
                    const bestCell = Boolean(
                      row.highlight && winnerId === offer.id,
                    )
                    return (
                      <td
                        key={offer.id}
                        className={`px-3 py-3 text-center ${
                          bestCell
                            ? "bg-accent-subtle font-semibold text-accent"
                            : "bg-surface"
                        }`}
                      >
                        {row.value(offer)}
                        {bestCell && (
                          <span className="ml-2 hidden rounded-full bg-accent-subtle px-2 py-1 text-[10px] tablet:inline">
                            {t.best}
                          </span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
