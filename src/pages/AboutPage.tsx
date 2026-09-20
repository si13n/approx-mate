import { MarketingPageShell } from "../components/MarketingPageShell"
import { Button } from "../components/ui/Button"
import "./StaticPages.css"

const answers = [
  {
    number: "01",
    title: "See what you keep",
    body: "Compare UoP and B2B take-home with Poland-specific taxes and costs.",
  },
  {
    number: "02",
    title: "Read the whole offer",
    body: "Pull out pay, location, skills, responsibilities and hidden gaps.",
  },
  {
    number: "03",
    title: "Choose with context",
    body: "Compare opportunities and prepare better questions before you commit.",
  },
]

export function AboutPage() {
  return (
    <MarketingPageShell activePage="about">
      <main className="static-page__main about-page__main">
        <section className="about-hero" aria-labelledby="about-heading">
          <div className="about-hero__copy">
            <p className="static-page__eyebrow">ABOUT APPROXMATE</p>
            <h1 id="about-heading" className="about-hero__title">
              Career decisions are hard.
              <br />
              The numbers shouldn&apos;t be.
            </h1>
            <p className="about-hero__intro">
              ApproxMate turns Polish salary rules and job descriptions into
              clear, practical answers — without spreadsheets or jargon.
            </p>
            <p className="about-hero__meta">
              Built in Kraków · For people working in Poland
            </p>
          </div>

          <aside className="about-why" aria-label="Why ApproxMate exists">
            <p className="static-page__eyebrow">WHY IT EXISTS</p>
            <p className="about-why__title">
              Because a job offer is more than a gross number.
            </p>
          </aside>
        </section>

        <section className="about-answers" aria-labelledby="answers-heading">
          <h2 id="answers-heading" className="static-page__section-title">
            One tool. Three clear answers.
          </h2>
          <div className="about-answers__grid">
            {answers.map((answer) => (
              <article className="about-answer" key={answer.number}>
                <span className="static-page__number">{answer.number}</span>
                <h3>{answer.title}</h3>
                <p>{answer.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="static-cta about-cta">
          <div className="static-cta__copy">
            <h2>Made for practical decisions, not perfect forecasts.</h2>
            <p>
              Estimates stay transparent, so you can see the assumptions behind
              every result.
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
            Try ApproxMate →
          </Button>
        </section>
      </main>
    </MarketingPageShell>
  )
}
