import { useState } from "react"
import type { Translation } from "../../../i18n/translations"
import { Button } from "../../../components/ui/Button"
import { jobXRayIcons } from "../icons"
import type { JobAnalysis, SalaryRange } from "../types"
import { OfferSourceDialog } from "./OfferSourceDialog"

interface OfferAnalysisPanelProps {
  analysis: JobAnalysis
  sourceText: string | null
  t: Translation
  onCompare: () => void
}

function formatNumber(value: number): string {
  if (value >= 1000 && value % 1000 === 0) return `${value / 1000}k`
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(
    value,
  )
}

function formatSalary(salary: SalaryRange | null): string {
  if (!salary || salary.min === null) return ""
  const range =
    salary.max !== null && salary.max !== salary.min
      ? `${formatNumber(salary.min)}–${formatNumber(salary.max)}`
      : formatNumber(salary.min)
  return `${range}${salary.currency ? ` ${salary.currency}` : ""}`
}

interface IconProps {
  src: string
  size?: string
}

function Icon({ src, size = "size-4" }: IconProps) {
  return (
    <img src={src} alt="" aria-hidden="true" className={`${size} shrink-0`} />
  )
}

export function OfferAnalysisPanel({
  analysis,
  sourceText,
  t,
  onCompare,
}: OfferAnalysisPanelProps) {
  const [sourceOpen, setSourceOpen] = useState(false)
  const missing = t.notMentioned
  const salary = analysis.salary.value
  const salaryDescription = salary
    ? [
        salary.amountType === "gross"
          ? t.grossLabel.toLocaleLowerCase()
          : salary.amountType === "net"
            ? t.netLabel.toLocaleLowerCase()
            : salary.amountType === "invoice"
              ? t.invoiceLabel
              : null,
        salary.period ? t.salaryPeriod[salary.period] : null,
      ]
        .filter(Boolean)
        .join(" / ")
    : ""
  const workMode = analysis.workMode.value
    ? t.workModes[analysis.workMode.value]
    : missing
  const contract = analysis.contractTypes.value?.join(" / ") ?? missing
  const benefits = analysis.benefits.value?.slice(0, 2).join(", ") ?? missing
  const subtitle = [analysis.company.value, analysis.location.value, workMode]
    .filter(Boolean)
    .join(" · ")
  const detailRows = [
    {
      label: t.location,
      value: analysis.location.value ?? missing,
      icon: jobXRayIcons.location,
    },
    {
      label: t.seniority,
      value: analysis.seniority.value ?? missing,
      icon: jobXRayIcons.seniority,
    },
    { label: t.contractType, value: contract, icon: jobXRayIcons.contract },
    {
      label: t.experience,
      value: analysis.experience.value ?? missing,
      icon: jobXRayIcons.experience,
    },
    {
      label: t.english,
      value: analysis.english.value ?? missing,
      icon: jobXRayIcons.english,
    },
    {
      label: t.company,
      value: analysis.company.value ?? missing,
      icon: jobXRayIcons.company,
    },
    { label: t.benefits, value: benefits, icon: jobXRayIcons.benefits },
  ]

  const viewSource = () => {
    if (analysis.source.url) {
      window.open(analysis.source.url, "_blank", "noopener,noreferrer")
      return
    }
    if (sourceText) setSourceOpen(true)
  }

  return (
    <>
      <div
        id={`workspace-panel-${analysis.id}`}
        role="tabpanel"
        aria-labelledby={`workspace-tab-${analysis.id}`}
        className="rounded-b-panel rounded-tr-panel border border-border bg-surface p-4 tablet:p-6"
      >
        <header className="flex flex-col gap-3 tablet:flex-row tablet:items-start tablet:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.06em] text-content-secondary">
              {t.offerAnalysis}
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold">
              {analysis.title.value ?? t.untitledOffer}
            </h2>
            <p className="mt-0.5 truncate text-xs text-content-secondary">
              {subtitle}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-1 tablet:items-end">
            <span className="inline-flex min-h-7 items-center gap-1.5 rounded-full bg-success-subtle px-3 text-xs font-semibold text-success">
              <Icon src={jobXRayIcons.sourceCheck} size="size-3.5" />
              {analysis.source.kind === "url"
                ? t.parsedFromJobPost
                : t.parsedFromPastedText}
            </span>
            <button
              type="button"
              onClick={viewSource}
              disabled={!analysis.source.url && !sourceText}
              className="min-h-8 text-xs font-semibold text-action hover:underline focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50"
            >
              {t.viewSource}
            </button>
          </div>
        </header>

        <div className="mt-4 grid gap-3 desktop:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0">
            <section className="grid overflow-hidden rounded-card border border-border bg-surface-subtle tablet:grid-cols-3">
              <div className="flex min-h-[84px] items-center gap-3 px-4 py-3">
                <span className="flex size-8 items-center justify-center rounded-xl bg-primary-subtle">
                  <Icon src={jobXRayIcons.employment} size="size-[18px]" />
                </span>
                <div>
                  <p className="text-xs text-content-secondary">
                    {t.employment}
                  </p>
                  <p className="font-display text-sm font-semibold">
                    {contract}
                  </p>
                </div>
              </div>
              <div className="flex min-h-[84px] items-center gap-3 border-t border-border px-4 py-3 tablet:border-l tablet:border-t-0">
                <span className="flex size-8 items-center justify-center rounded-xl bg-success-subtle">
                  <Icon src={jobXRayIcons.salary} size="size-[18px]" />
                </span>
                <div>
                  <p className="text-xs text-content-secondary">{t.salary}</p>
                  <p className="font-display text-sm font-semibold">
                    {formatSalary(salary) || missing}
                  </p>
                  {salaryDescription && (
                    <p className="mt-0.5 text-[11px] text-content-secondary">
                      {salaryDescription}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex min-h-[84px] items-center gap-3 border-t border-border px-4 py-3 tablet:border-l tablet:border-t-0">
                <span className="flex size-8 items-center justify-center rounded-xl bg-accent-subtle">
                  <Icon src={jobXRayIcons.workMode} size="size-[18px]" />
                </span>
                <div>
                  <p className="text-xs text-content-secondary">{t.workMode}</p>
                  <p className="font-display text-sm font-semibold">
                    {workMode}
                  </p>
                  {analysis.officeDaysPerWeek.value && (
                    <p className="mt-0.5 text-[11px] text-content-secondary">
                      {t.officeDays(analysis.officeDaysPerWeek.value)}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="mt-4" aria-labelledby={`skills-${analysis.id}`}>
              <h3
                id={`skills-${analysis.id}`}
                className="font-display text-lg font-semibold"
              >
                {t.requiredSkills}
              </h3>
              {analysis.requiredSkills.value?.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {analysis.requiredSkills.value.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-primary-subtle px-2.5 py-1.5 text-xs text-action"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-content-secondary">{missing}</p>
              )}
            </section>

            <section
              className="mt-4"
              aria-labelledby={`responsibilities-${analysis.id}`}
            >
              <h3
                id={`responsibilities-${analysis.id}`}
                className="font-display text-lg font-semibold"
              >
                {t.responsibilities}
              </h3>
              {analysis.responsibilities.value?.length ? (
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-5">
                  {analysis.responsibilities.value.map((responsibility) => (
                    <li key={responsibility}>{responsibility}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-content-secondary">{missing}</p>
              )}
            </section>

            <section className="mt-4" aria-labelledby={`nice-${analysis.id}`}>
              <h3
                id={`nice-${analysis.id}`}
                className="font-display text-lg font-semibold"
              >
                {t.niceToHave}
              </h3>
              {analysis.niceToHave.value?.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {analysis.niceToHave.value.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-surface-subtle px-2.5 py-1.5 text-xs text-content-secondary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-content-secondary">{missing}</p>
              )}
            </section>
          </div>

          <aside
            className="rounded-card border border-border bg-surface-subtle p-4"
            aria-labelledby={`details-${analysis.id}`}
          >
            <h3
              id={`details-${analysis.id}`}
              className="flex items-center gap-2 font-display text-lg font-semibold"
            >
              <span className="flex size-6 items-center justify-center rounded-lg bg-primary-subtle">
                <Icon src={jobXRayIcons.details} size="size-3.5" />
              </span>
              {t.offerDetails}
            </h3>
            <dl className="mt-3">
              {detailRows.map((row) => (
                <div
                  key={row.label}
                  className="grid min-h-14 grid-cols-[16px_1fr_minmax(0,1.4fr)] items-center gap-2 border-b border-border last:border-b-0"
                >
                  <Icon src={row.icon} />
                  <dt className="text-xs text-content-secondary">
                    {row.label}
                  </dt>
                  <dd className="break-words text-right text-xs font-semibold">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </div>

      <section className="mt-0 flex min-h-[104px] flex-col justify-between gap-3 rounded-card bg-inverse p-4 text-content-inverse tablet:flex-row tablet:items-center">
        <div>
          <h3 className="font-display text-2xl font-semibold">
            {t.compareOffers}
          </h3>
          <p className="mt-0.5 text-xs text-border-strong">
            {t.compareDescription}
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={onCompare}
          trailingIcon={<span aria-hidden="true">→</span>}
          className="border-0 text-content"
        >
          {t.compareOffers}
        </Button>
      </section>

      <OfferSourceDialog
        open={sourceOpen}
        sourceText={sourceText ?? ""}
        t={t}
        onClose={() => setSourceOpen(false)}
      />
    </>
  )
}
