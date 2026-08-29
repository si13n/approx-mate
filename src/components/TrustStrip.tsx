import type { Translation } from "../i18n/translations"

interface TrustStripProps {
  t: Translation
  rateLabel: string
  isFallback: boolean
}

export function TrustStrip({ t, rateLabel, isFallback }: TrustStripProps) {
  return (
    <section
      className="rounded-card bg-page px-3.5 py-3 text-xs text-content-secondary tablet:flex tablet:min-h-[52px] tablet:items-center tablet:justify-between tablet:px-[18px]"
      aria-label={t.assumptionsTitle}
    >
      <p className="mb-1 font-semibold text-content tablet:hidden">
        {t.assumptionsTitle}
      </p>
      <div className="hidden items-center gap-2 tablet:flex">
        <span className="text-action" aria-hidden="true">
          ✓
        </span>
        <span>{t.rulesExample}</span>
      </div>
      <div className="hidden items-center gap-2 tablet:flex">
        <span className="text-action" aria-hidden="true">
          ↻
        </span>
        <span>
          {isFallback ? t.fallbackRates : `${t.ratesDaily} · ${rateLabel}`}
        </span>
      </div>
      <div className="hidden items-center gap-2 tablet:flex">
        <span className="text-action" aria-hidden="true">
          i
        </span>
        <span>{t.transparentAssumptions}</span>
      </div>
      <div className="hidden items-center gap-2 tablet:flex">
        <span className="text-action" aria-hidden="true">
          ⚠
        </span>
        <span>{t.estimateAdvice}</span>
      </div>
      <p className="m-0 leading-[18px] tablet:hidden">
        {t.rulesExample} ·{" "}
        {isFallback ? t.fallbackRates : `${t.ratesDaily} (${rateLabel})`} ·{" "}
        {t.estimateAdvice.toLowerCase()}.
      </p>
    </section>
  )
}
