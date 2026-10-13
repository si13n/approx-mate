import { Button } from "../ui/Button"
import locationIcon from "../../assets/job-xray/location.png"
import workModeIcon from "../../assets/job-xray/work-mode.png"
import contractIcon from "../../assets/job-xray/contract.png"
import scheduleIcon from "../../assets/job-xray/schedule.png"
import experienceIcon from "../../assets/job-xray/experience.png"
import englishIcon from "../../assets/job-xray/english.png"
import redFlagIcon from "../../assets/job-xray/red-flag.svg"
import compareIcon from "../../assets/job-xray/compare.svg"
import calculatorIcon from "../../assets/job-xray/calculator.svg"

// Fixed Figma content: this preview is independent of the input and makes no API calls.
const details = [
  { label: "Location", value: "Kraków", icon: locationIcon },
  { label: "Work mode", value: "Hybrid", icon: workModeIcon },
  { label: "Contract", value: "B2B or UoP", icon: contractIcon },
  { label: "Schedule", value: "Full-time", icon: scheduleIcon },
  { label: "Experience", value: "8+ years", icon: experienceIcon },
  { label: "English", value: "B2+", icon: englishIcon },
]

const skills = ["React", "TypeScript", "CI/CD", "Docker"]
const responsibilities = ["Lead strategy", "Grow the team", "Improve release confidence"]
const flags = ["Salary depends on contract", "Reporting line unclear", "On-call not specified"]
const questions = [
  "Who does this role report to?",
  "How is the team structured?",
  "Is on-call expected?",
]

export function JobXRayPreview() {
  return (
    <section className="xray-results" aria-labelledby="xray-job-title" lang="en">
      <div className="xray-identity">
        <h2 id="xray-job-title">Senior Engineering Manager</h2>
        <Button variant="ghost" size="sm" disabled className="xray-static-action xray-original">
          <span className="xray-desktop-copy">View original offer ↗</span>
          <span className="xray-mobile-copy">View offer ↗</span>
        </Button>
        <p className="xray-source">
          <span>Google</span>
          <small>LinkedIn · 3 days ago</small>
        </p>
      </div>

      <div className="xray-decision">
        <div className="xray-snapshot">
          <section className="xray-score" aria-labelledby="xray-score-heading">
            <h3 id="xray-score-heading">Offer Score</h3>
            <p className="xray-score-value"><strong>78</strong><span>/ 100</span></p>
            <p className="xray-score-label">Clear</p>
            <div className="xray-score-track" aria-hidden="true"><span /></div>
          </section>
          <section className="xray-compensation" aria-labelledby="xray-compensation-heading">
            <h3 id="xray-compensation-heading">Compensation</h3>
            <p>$10,000</p>
          </section>
        </div>
        <section className="xray-summary" aria-labelledby="xray-summary-heading">
          <h3 id="xray-summary-heading"><span aria-hidden="true">✦</span> AI summary</h3>
          <p>Strong leadership role with modern AI development.<br />Good fit if hybrid work and contract flexibility suit you.</p>
        </section>
      </div>

      <section className="xray-glance" aria-labelledby="xray-glance-heading">
        <h3 id="xray-glance-heading">At a glance</h3>
        <dl>
          {details.map(({ label, value, icon }) => (
            <div className="xray-detail" key={label}>
              <img src={icon} alt="" width="18" height="18" />
              <div><dt>{label}</dt><dd>{value}</dd></div>
            </div>
          ))}
        </dl>
      </section>

      <div className="xray-essentials">
        <section className="xray-card xray-skills" aria-labelledby="xray-skills-heading">
          <h3 id="xray-skills-heading">Required skills</h3>
          <ul>{skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
        </section>
        <section className="xray-card xray-responsibilities" aria-labelledby="xray-responsibilities-heading">
          <h3 id="xray-responsibilities-heading">Responsibilities</h3>
          <ul>{responsibilities.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul>
        </section>
        <section className="xray-card xray-flags" aria-labelledby="xray-flags-heading">
          <h3 id="xray-flags-heading">Red flags &amp; gaps</h3>
          <ul>{flags.map((flag) => <li key={flag}><img src={redFlagIcon} alt="" />{flag}</li>)}</ul>
        </section>
      </div>

      <section className="xray-questions" aria-labelledby="xray-questions-heading">
        <h3 id="xray-questions-heading">Questions for the recruiter</h3>
        <div className="xray-questions-actions">
          <ol>{questions.map((question) => <li key={question}>{question}</li>)}</ol>
          <Button variant="ghost" size="sm" disabled className="xray-static-action xray-copy">
            <span className="xray-desktop-copy">Copy</span>
            <span className="xray-mobile-copy">Copy questions →</span>
          </Button>
        </div>
      </section>
    </section>
  )
}

const recommendations = [
  {
    id: "compare", title: "Compare offers", icon: compareIcon,
    description: "Compare salary, contract and benefits side by side.",
    first: { label: "Current offer", value: "20k PLN gross" },
    second: { label: "Next offer", value: "24k PLN gross" },
    action: "Compare offers →",
  },
  {
    id: "calculator", title: "Calculator", icon: calculatorIcon,
    description: "Estimate take-home pay for B2B or employment.",
    first: { label: "Desired net", value: "$5,000" },
    second: { label: "Offer gross", value: "≈ $7,000" },
    action: "Open calculator →",
  },
]

export function JobXRayRecommendations() {
  return (
    <section className="xray-recommendations" aria-labelledby="xray-recommendations-heading" lang="en">
      <div className="xray-recommendations-heading">
        <p className="xray-eyebrow">EXPLORE MORE</p>
        <h2 id="xray-recommendations-heading">Recommended next</h2>
        <p>Keep moving with the tools that fit the next decision.</p>
      </div>
      <div className="xray-recommendation-grid">
        {recommendations.map((card) => (
          <article className={`xray-recommendation xray-recommendation--${card.id}`} key={card.id}>
            <div className="xray-recommendation-heading">
              <div className="xray-icon-well"><img src={card.icon} alt="" /></div>
              <div><h3>{card.title}</h3><p>{card.description}</p></div>
            </div>
            <div className="xray-comparison">
              <dl><dt>{card.first.label}</dt><dd>{card.first.value}</dd></dl>
              <span>VS</span>
              <dl><dt>{card.second.label}</dt><dd>{card.second.value}</dd></dl>
            </div>
            <Button variant="ghost" disabled className="xray-static-action xray-recommendation-action">{card.action}</Button>
          </article>
        ))}
      </div>
    </section>
  )
}
