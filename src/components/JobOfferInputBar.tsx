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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAnalyze()
    }
  }

  return (
    <section
      className="flex min-w-0 flex-col gap-2"
      aria-labelledby="job-offer-label"
    >
      <label
        id="job-offer-label"
        className="text-[13px] font-normal text-text-secondary"
      >
        Have a job offer?
      </label>
      <div className="flex h-[52px] min-w-0 items-center justify-between gap-2 rounded-[12px] border border-border-subtle bg-white px-2 py-1.5 pl-3">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <img
            src={iconLink}
            alt=""
            className="size-[18px] shrink-0"
            aria-hidden="true"
          />
          <input
            type="text"
            value={jobOfferInput}
            onChange={(e) => setJobOfferInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.vacancyPlaceholder}
            className="min-w-0 flex-1 bg-transparent text-[12px] font-normal text-text-primary outline-none placeholder:text-text-muted min-[360px]:text-[13px] desktop:text-[14px]"
          />
        </div>
        <button
          onClick={handleAnalyze}
          type="button"
          className="h-10 shrink-0 rounded-[10px] bg-action-primary px-3 text-[12px] font-medium text-white shadow-[0_4px_12px_-4px_rgba(0,0,0,0.12)] transition-opacity hover:opacity-90 min-[360px]:px-4 desktop:px-6 desktop:text-[13px]"
        >
          Analyze
        </button>
      </div>
    </section>
  )
}
