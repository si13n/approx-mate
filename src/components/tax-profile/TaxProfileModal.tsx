import { useEffect, useState } from "react"
import {
  DEFAULT_TAX_PROFILE,
  TAX_2026,
  type B2BZUSProfile,
  type TaxProfile,
  type UoPKUPType,
} from "../../config/tax"
import type { Translation } from "../../i18n/translations"
import {
  trackB2BRateChanged,
  trackB2BZUSChanged,
  trackTaxProfileReset,
  trackUoPKUPChanged,
  trackUoPPPKChanged,
} from "../../lib/analytics"
import { Button } from "../ui/Button"
import { Dialog } from "../ui/Dialog"
import { IconButton } from "../ui/IconButton"
import { SegmentedControl } from "../ui/SegmentedControl"
import { Switch } from "../ui/Switch"

interface TaxProfileModalProps {
  open: boolean
  profile: TaxProfile
  t: Translation
  onClose: () => void
  onSave: (profile: TaxProfile) => void
}

function cloneProfile(profile: TaxProfile): TaxProfile {
  return { b2b: { ...profile.b2b }, uop: { ...profile.uop } }
}

export function TaxProfileModal({
  open,
  profile,
  t,
  onClose,
  onSave,
}: TaxProfileModalProps) {
  const [draft, setDraft] = useState<TaxProfile>(() => cloneProfile(profile))

  useEffect(() => {
    if (open) setDraft(cloneProfile(profile))
  }, [open, profile])

  const save = () => {
    if (draft.b2b.ryczaltRate !== profile.b2b.ryczaltRate)
      trackB2BRateChanged(draft.b2b.ryczaltRate)
    if (draft.b2b.zusProfile !== profile.b2b.zusProfile)
      trackB2BZUSChanged(draft.b2b.zusProfile)
    if (draft.uop.kupType !== profile.uop.kupType)
      trackUoPKUPChanged(draft.uop.kupType)
    if (draft.uop.ppkEnabled !== profile.uop.ppkEnabled)
      trackUoPPPKChanged(draft.uop.ppkEnabled)
    onSave(draft)
    onClose()
  }

  const reset = () => {
    setDraft(cloneProfile(DEFAULT_TAX_PROFILE))
    trackTaxProfileReset()
  }

  return (
    <Dialog open={open} titleId="tax-profile-title" onClose={onClose}>
      <div className="flex min-h-full flex-col p-4 tablet:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="tax-profile-title"
              className="font-display text-2xl font-bold tablet:text-[28px]"
            >
              {t.taxProfile}
            </h2>
            <p className="mt-3 max-w-[610px] text-[13px] leading-[18px] text-content-secondary tablet:mt-1 tablet:text-sm">
              {t.setAssumptions}
            </p>
          </div>
          <IconButton
            label={`${t.close} ${t.taxProfile}`}
            onClick={onClose}
            className="rounded-xl bg-surface-subtle text-[22px]"
          >
            ×
          </IconButton>
        </div>

        <div className="mt-3 flex flex-1 flex-col gap-3 tablet:mt-4 tablet:gap-4">
          <section
            className="rounded-card border border-border bg-surface-subtle p-3.5 tablet:rounded-[18px] tablet:p-5"
            aria-labelledby="b2b-settings-title"
          >
            <div className="flex items-center gap-2.5 tablet:gap-3">
              <span className="rounded-full bg-primary-subtle px-2.5 py-1.5 text-xs font-semibold text-action">
                B2B
              </span>
              <div>
                <h3
                  id="b2b-settings-title"
                  className="font-display text-base font-semibold tablet:text-lg"
                >
                  {t.businessSettings}
                </h3>
                <p className="hidden text-xs text-content-secondary tablet:block">
                  {t.businessDescription}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <div className="mb-1.5 flex items-center justify-between gap-3 text-xs font-medium">
                <label htmlFor="ryczalt-rate">{t.ryczaltRate}</label>
                <a
                  href="https://www.podatki.gov.pl/ryczalt/"
                  target="_blank"
                  rel="noreferrer"
                  className="hidden font-semibold text-action tablet:block"
                >
                  {t.howToChoose}
                </a>
              </div>
              <select
                id="ryczalt-rate"
                aria-describedby="ryczalt-rate-help"
                value={draft.b2b.ryczaltRate}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    b2b: {
                      ...current.b2b,
                      ryczaltRate: Number(event.target.value),
                    },
                  }))
                }
                className="h-11 w-full rounded-[10px] border border-border-strong bg-surface px-3 font-semibold outline-none focus-visible:ring-2 focus-visible:ring-primary tablet:h-[52px] tablet:rounded-[13px] tablet:text-xl"
              >
                {TAX_2026.b2b.ryczaltRates.map((rate) => (
                  <option key={rate} value={rate}>
                    {Math.round(rate * 100)}%
                  </option>
                ))}
              </select>
              <p
                id="ryczalt-rate-help"
                className="mt-1.5 text-xs text-content-secondary"
              >
                {t.ryczaltHelp}
              </p>
            </div>
            <div className="mt-3">
              <div className="mb-1.5 flex justify-between gap-3 text-xs font-medium">
                <span>{t.zusPlan}</span>
                <span className="hidden text-content-secondary tablet:block">
                  {t.appliedB2B}
                </span>
              </div>
              <SegmentedControl<B2BZUSProfile>
                compact
                ariaLabel={t.zusPlan}
                value={draft.b2b.zusProfile}
                onChange={(zusProfile) =>
                  setDraft((current) => ({
                    ...current,
                    b2b: { ...current.b2b, zusProfile },
                  }))
                }
                options={[
                  { value: "ulgaNaStart", label: t.start },
                  { value: "preferential", label: t.preferential },
                  { value: "full", label: t.fullZus },
                ]}
              />
            </div>
          </section>

          <section
            className="rounded-card border border-border bg-surface-subtle p-3.5 tablet:rounded-[18px] tablet:p-5"
            aria-labelledby="uop-settings-title"
          >
            <div className="flex items-center gap-2.5 tablet:gap-3">
              <span className="rounded-full bg-accent-subtle px-2.5 py-1.5 text-xs font-semibold text-accent">
                UoP
              </span>
              <div>
                <h3
                  id="uop-settings-title"
                  className="font-display text-base font-semibold tablet:text-lg"
                >
                  {t.employmentSettings}
                </h3>
                <p className="hidden text-xs text-content-secondary tablet:block">
                  {t.employmentDescription}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <p className="mb-1.5 text-xs font-medium">{t.kup}</p>
              <SegmentedControl<UoPKUPType>
                compact
                tone="accent"
                ariaLabel={t.kup}
                value={draft.uop.kupType}
                onChange={(kupType) =>
                  setDraft((current) => ({
                    ...current,
                    uop: { ...current.uop, kupType },
                  }))
                }
                options={[
                  { value: "standard", label: t.standard },
                  { value: "commuter", label: t.commuter },
                ]}
              />
            </div>
            <div className="mt-3 flex min-h-14 items-center justify-between rounded-[10px] border border-border bg-surface pl-3 pr-1.5 tablet:rounded-xl tablet:pl-3.5 tablet:pr-3">
              <div>
                <p className="text-[13px] font-semibold">{t.ppk}</p>
                <p className="text-[11px] text-content-secondary">
                  {t.ppkDescription}
                </p>
              </div>
              <Switch
                checked={draft.uop.ppkEnabled}
                onChange={(ppkEnabled) =>
                  setDraft((current) => ({
                    ...current,
                    uop: { ...current.uop, ppkEnabled },
                  }))
                }
                label={t.ppk}
              />
            </div>
          </section>

          <div className="rounded-[10px] bg-primary-subtle px-3 py-2.5 text-xs text-content-secondary tablet:flex tablet:items-center tablet:justify-between tablet:bg-transparent tablet:px-0 tablet:py-0">
            <span>{t.taxRulesNote}</span>
            <a
              href="https://www.podatki.gov.pl/"
              target="_blank"
              rel="noreferrer"
              className="hidden font-semibold text-action tablet:block"
            >
              {t.officialSources} →
            </a>
          </div>
        </div>

        <div className="sticky bottom-0 mt-4 grid grid-cols-[112px_1fr] gap-3 bg-surface pt-3 tablet:static tablet:grid-cols-[194px_1fr] tablet:pt-0">
          <Button variant="secondary" size="lg" onClick={reset}>
            {t.reset}
          </Button>
          <Button size="lg" onClick={save}>
            {t.saveProfile}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
