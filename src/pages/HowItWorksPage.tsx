import { MarketingPageShell } from "../components/MarketingPageShell"
import { Button } from "../components/ui/Button"
import "./StaticPages.css"

const steps = [
  {
    number: "01",
    title: "Add the offer",
    body: "Enter a salary in Calculator or paste a vacancy into Job X-RAY.",
  },
  {
    number: "02",
    title: "See the real picture",
    body: "Review take-home pay, contract costs, key skills and red flags.",
  },
  {
    number: "03",
    title: "Choose with confidence",
    body: "Compare options, prepare better questions and decide what fits.",
  },
]

const trustPoints = [
  "Poland-specific rules",
  "Transparent assumptions",
  "No account required",
]

export function HowItWorksPage() {
  return (
    <MarketingPageShell activePage="how-it-works">
      <main className="static-page__main how-page__main">
        <section className="how-hero" aria-labelledby="how-heading">
          <p className="static-page__eyebrow">HOW IT WORKS</p>
          <h1 id="how-heading">From offer to decision in minutes.</h1>
          <p>
            Start with a salary or vacancy. ApproxMate turns it into the context
            you need to choose well.
          </p>
        </section>

        <section className="how-steps" aria-labelledby="steps-heading">
          <h2 id="steps-heading">Three steps. No guesswork.</h2>
          <div className="how-steps__grid">
            {steps.map((step) => (
              <article className="how-step" key={step.number}>
                <span className="static-page__number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <ul className="how-trust" aria-label="ApproxMate benefits">
          {trustPoints.map((point) => (
            <li key={point}>✓&nbsp;&nbsp;{point}</li>
          ))}
        </ul>

        <section className="static-cta how-cta">
          <div className="static-cta__copy">
            <h2>Ready to see the full picture?</h2>
            <p>
              Start with the number you already have. We&apos;ll help with the
              rest.
            </p>
          </div>
          <Button
            variant="dark"
            size="sm"
            className="static-cta__button"
            onClick={() => {
              window.location.href = "/calculator"
            }}
          >
            Start with Calculator
          </Button>
        </section>
      </main>
    </MarketingPageShell>
  )
}
