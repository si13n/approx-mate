import { useId } from "react"
import { Button } from "./ui/Button"
import compareIcon from "../assets/job-xray/compare.svg"
import calculatorIcon from "../assets/job-xray/calculator.svg"
import jobXRayIcon from "../assets/recommendations/job-xray.svg"
import "./RecommendedNext.css"

type Feature = "calculator" | "job-xray" | "compare"

const recommendations = {
  "job-xray": {
    title: "Job X-Ray", icon: jobXRayIcon, tone: "blue",
    description: "See the key details, skills and risks in a job offer.",
    first: { label: "Offer Score", value: "78 / 100" },
    second: { label: "Key details", value: "Skills & risks" },
    separator: "→", action: "Open Job X-Ray →",
  },
  compare: {
    title: "Compare offers", icon: compareIcon, tone: "purple",
    description: "Compare salary, contract and benefits side by side.",
    first: { label: "Current offer", value: "20k PLN gross" },
    second: { label: "Next offer", value: "24k PLN gross" },
    separator: "VS", action: "Compare offers →",
  },
  calculator: {
    title: "Calculator", icon: calculatorIcon, tone: "blue",
    description: "Estimate take-home pay for B2B or employment.",
    first: { label: "Desired net", value: "$5,000" },
    second: { label: "Offer gross", value: "≈ $7,000" },
    separator: "VS", action: "Open calculator →",
  },
} satisfies Record<Feature, {
  title: string
  icon: string
  tone: string
  description: string
  first: { label: string; value: string }
  second: { label: string; value: string }
  separator: string
  action: string
}>

const pageFeatures = {
  calculator: ["job-xray", "compare"],
  "job-xray": ["compare", "calculator"],
} as const

export function RecommendedNext({ page }: { page: keyof typeof pageFeatures }) {
  const headingId = useId()

  return (
    <section className="recommended-next" aria-labelledby={headingId} lang="en">
      <div className="recommended-next__heading">
        <p className="recommended-next__eyebrow">EXPLORE MORE</p>
        <h2 id={headingId}>Recommended next</h2>
        <p>Keep moving with the tools that fit the next decision.</p>
      </div>
      <div className="recommended-next__grid">
        {pageFeatures[page].map((feature) => {
          const card = recommendations[feature]
          return (
            <article className={`recommendation-card recommendation-card--${card.tone}`} key={feature}>
              <div className="recommendation-card__heading">
                <div className="recommendation-card__icon"><img src={card.icon} alt="" /></div>
                <div><h3>{card.title}</h3><p>{card.description}</p></div>
              </div>
              <div className="recommendation-card__preview">
                <dl><dt>{card.first.label}</dt><dd>{card.first.value}</dd></dl>
                <span>{card.separator}</span>
                <dl><dt>{card.second.label}</dt><dd>{card.second.value}</dd></dl>
              </div>
              <Button variant="ghost" disabled className="recommendation-card__action">{card.action}</Button>
            </article>
          )
        })}
      </div>
    </section>
  )
}
