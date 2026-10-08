import { useEffect, useState } from "react"
import {
  DEFAULT_TAX_PROFILE,
  DEFAULT_TAX_RULES,
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
import "./TaxProfileModal.css"

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
    <Dialog
      open={open}
      titleId="tax-profile-title"
      descriptionId="tax-profile-description"
      className="tax-profile"
      onClose={onClose}
    >
      <header className="tax-profile__header">
        <div>
          <h2 id="tax-profile-title">{t.taxProfile}</h2>
          <p id="tax-profile-description">{t.setAssumptions}</p>
        </div>
        <IconButton
          label={`${t.close} ${t.taxProfile}`}
          onClick={onClose}
          className="tax-profile__close"
        >
          <span aria-hidden="true">×</span>
        </IconButton>
      </header>

      <div className="tax-profile__body">
        <div className="tax-profile__sections">
          <section
            className="tax-profile__section tax-profile__section--b2b"
            aria-labelledby="b2b-settings-title"
          >
            <div className="tax-profile__section-heading">
              <span className="tax-profile__contract">B2B</span>
              <h3 id="b2b-settings-title">{t.businessSettings}</h3>
              <p>{t.businessDescription}</p>
            </div>

            <div className="tax-profile__field">
              <div className="tax-profile__label-row">
                <label htmlFor="ryczalt-rate">{t.ryczaltRate}</label>
                <a
                  href={DEFAULT_TAX_RULES.sources.pit}
                  target="_blank"
                  rel="noreferrer"
                  className="tax-profile__link"
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
                className="tax-profile__select"
              >
                {DEFAULT_TAX_RULES.b2b.ryczaltRates.map((rate) => (
                  <option key={rate} value={rate}>
                    {Number((rate * 100).toFixed(1))}%
                  </option>
                ))}
              </select>
              <p id="ryczalt-rate-help" className="tax-profile__hint">
                {t.ryczaltHelp}
              </p>
            </div>

            <div className="tax-profile__field">
              <p className="tax-profile__label">{t.zusPlan}</p>
              <SegmentedControl<B2BZUSProfile>
                compact
                className="tax-profile__segments tax-profile__segments--zus"
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
            className="tax-profile__section tax-profile__section--uop"
            aria-labelledby="uop-settings-title"
          >
            <div className="tax-profile__section-heading">
              <span className="tax-profile__contract">UoP</span>
              <h3 id="uop-settings-title">{t.employmentSettings}</h3>
              <p>{t.employmentDescription}</p>
            </div>

            <div className="tax-profile__field">
              <p className="tax-profile__label">{t.kup}</p>
              <SegmentedControl<UoPKUPType>
                compact
                className="tax-profile__segments tax-profile__segments--kup"
                ariaLabel={t.kup}
                value={draft.uop.kupType}
                onChange={(kupType) =>
                  setDraft((current) => ({
                    ...current,
                    uop: { ...current.uop, kupType },
                  }))
                }
                options={[
                  {
                    value: "standard",
                    label: t.standard,
                    description: `${DEFAULT_TAX_RULES.uop.kup.standard} PLN`,
                  },
                  {
                    value: "commuter",
                    label: t.commuter,
                    description: `${DEFAULT_TAX_RULES.uop.kup.commuter} PLN`,
                  },
                ]}
              />
            </div>

            <div className="tax-profile__ppk">
              <div>
                <p className="tax-profile__label">{t.ppk}</p>
                <p className="tax-profile__hint">{t.ppkDescription}</p>
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
                className="tax-profile__switch"
              />
            </div>
          </section>
        </div>

        <div className="tax-profile__note">
          <span>{t.taxRulesNote}</span>
          <a
            href="https://www.podatki.gov.pl/"
            target="_blank"
            rel="noreferrer"
            className="tax-profile__link"
          >
            {t.officialSources} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <footer className="tax-profile__footer">
        <Button
          variant="secondary"
          size="lg"
          className="tax-profile__reset"
          onClick={reset}
        >
          {t.reset}
        </Button>
        <Button
          variant="dark"
          size="lg"
          className="tax-profile__save"
          onClick={save}
        >
          {t.saveProfile}
        </Button>
      </footer>
    </Dialog>
  )
}
