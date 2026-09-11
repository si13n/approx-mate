import { useState } from "react"
import type { Translation } from "../i18n/translations"
import iconLink from "../assets/new-homepage/icon-link.svg"

interface JobOfferInputBarProps {
  t: Translation
}

export function JobOfferInputBar({ t }: JobOfferInputBarProps) {
  const [jobOfferInput, setJobOfferInput] = useState("")

  const handleAnalyze = () => {
    if (jobOfferInput.trim()) {
      sessionStorage.setItem("jobOfferInput", jobOfferInput)
      window.location.href = "/job-xray"
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAnalyze()
    }
  }

  return (
    <section
      className="mt-6 flex max-w-3xl flex-col gap-3 desktop:mt-8 desktop:gap-4"
      aria-labelledby="job-offer-label"
    >
      <label
        id="job-offer-label"
        className="text-xs font-medium text-content-secondary tablet:text-sm"
      >
        Have a job offer?
      </label>
      <div className="flex items-center gap-2 rounded-2xl border border-border-subtle bg-surface px-4 py-3 tablet:gap-3 tablet:px-4 tablet:py-3">
        <img
          src={iconLink}
          alt=""
          className="size-5 shrink-0 tablet:size-5"
          aria-hidden="true"
        />
        <input
          type="text"
          value={jobOfferInput}
          onChange={(e) => setJobOfferInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Paste a vacancy link or job description"
          className="min-w-0 flex-1 bg-transparent text-sm text-content placeholder-content-secondary outline-none tablet:text-base"
        />
        <button
          onClick={handleAnalyze}
          className="shrink-0 rounded-xl bg-action-primary px-4 py-2 font-semibold text-content-inverse hover:opacity-90 transition-opacity tablet:px-6 tablet:py-2.5"
        >
          Analyze
        </button>
      </div>
    </section>
  )
}
