import { useMemo, useRef, useState } from "react"
import { DEFAULT_TAX_PROFILE } from "../config/tax"
import { Footer } from "../components/Footer"
import { Header } from "../components/Header"
import { Button } from "../components/ui/Button"
import { translations } from "../i18n/translations"
import { trackLanguageChanged } from "../lib/analytics"
import { calculateB2BFromGross } from "../lib/taxCalculations"
import type { Lang } from "../types"
import "./NewHomePage.css"

function SalarySlider({
  sliderValue,
  onSliderChange,
}: {
  sliderValue: number
  onSliderChange: (value: number) => void
}) {
  const sliderMin = 5000
  const sliderMax = 100000
  const activeTrackRef = useRef<HTMLDivElement>(null)

  const getTrackWidth = (value: number) => {
    const fraction = Math.min(
      1,
      Math.max(0, (value - sliderMin) / (sliderMax - sliderMin)),
    )

    // Align the fill with the centre of the 26px mobile thumb.
    return `calc(${fraction * 100}% + ${13 - fraction * 26}px)`
  }

  return (
    <div className="home-slider">
      <div className="home-slider__track-area">
        <div className="home-slider__track" />
        <div
          ref={activeTrackRef}
          className="home-slider__active-track"
          style={{ width: getTrackWidth(sliderValue) }}
        />
        <input
          type="range"
          min={sliderMin}
          max={sliderMax}
          step={100}
          value={sliderValue}
          aria-label="Monthly gross salary in PLN"
          onChange={(event) => {
            const value = event.currentTarget.valueAsNumber
            if (activeTrackRef.current) {
              activeTrackRef.current.style.width = getTrackWidth(value)
            }
            onSliderChange(value)
          }}
          className="new-home-salary-slider"
        />
      </div>
      <div className="home-slider__labels">
        <span>5 000</span>
        <span>100 000</span>
      </div>
    </div>
  )
}

export function NewHomePage() {
  const [sliderValue, setSliderValue] = useState(22000)
  const [lang, setLang] = useState<Lang>("en")
  const t = translations[lang]

  const result = useMemo(() => {
    const calculation = calculateB2BFromGross(sliderValue, DEFAULT_TAX_PROFILE)

    return {
      gross: sliderValue,
      netAfterCosts: Math.max(0, calculation.monthlyNet - 1000),
    }
  }, [sliderValue])

  const formatAmount = (amount: number) =>
    Math.round(amount).toLocaleString("pl-PL")

  return (
    <div className="home-page">
      <div className="home-editorial home-editorial--left" aria-hidden="true">
        <span>Numbers</span>
        <span>for a</span>
        <span>brighter</span>
        <span>tomorrow</span>
        <span>·</span>
      </div>
      <div className="home-editorial home-editorial--right" aria-hidden="true">
        <span>Better</span>
        <span>jobs</span>
        <span>brighter</span>
        <span>futures</span>
        <span>·</span>
      </div>

      <div className="home-page__content">
        <Header
          lang={lang}
          t={t}
          onHome={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          onLanguageChange={(nextLang) => {
            setLang(nextLang)
            trackLanguageChanged(nextLang)
          }}
        />

        <main className="home-main">
          <section className="home-hero">
            <h1 className="home-hero__title">
              <span className="home-hero__title-desktop">
                Know what the offer
                <br />
                is really worth.
              </span>
              <span className="home-hero__title-mobile">
                Know what the
                <br />
                offer is really
                <br />
                worth.
              </span>
            </h1>
            <p className="home-hero__subtitle">
              Enter your offer and instantly see what you&apos;ll really take
              home in Poland.
            </p>
          </section>

          <div className="home-calculator-region">
            <section
              className="home-calculator-controls"
              aria-label="Salary calculator preview"
            >
              <div className="home-amount">
                <span className="home-amount__value">
                  {formatAmount(result.gross)}
                </span>
                <span className="home-amount__unit">PLN / month</span>
              </div>

              <SalarySlider
                sliderValue={sliderValue}
                onSliderChange={setSliderValue}
              />
            </section>

            <section className="home-result" aria-live="polite">
              <div className="home-result__main">
                <span className="home-result__lead">You keep</span>
                <span className="home-result__value">
                  {formatAmount(result.netAfterCosts)}
                </span>
                <span className="home-result__currency">PLN</span>
              </div>
              <p className="home-result__assumptions">
                B2B · Ryczałt 12% · Poland · 2026
              </p>
              <Button
                variant="brand"
                className="home-result__cta"
                style={{
                  background:
                    "linear-gradient(100deg, #7a45fa 0%, #40abff 100%)",
                  fontWeight: 500,
                }}
                onClick={() => {
                  window.location.href = "/calculator"
                }}
              >
                Calculate in detail →
              </Button>
            </section>
          </div>
        </main>

        <Footer t={t} />
      </div>
    </div>
  )
}

export default NewHomePage
