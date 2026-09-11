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
      className="flex flex-col gap-2 desktop:gap-2"
      aria-labelledby="job-offer-label"
    >
      <label
        id="job-offer-label"
        className="font-normal text-[14px] text-[#575e7a]"
      >
        Have a job offer?
      </label>
      <div className="flex h-[59px] items-center justify-between gap-3 rounded-[16px] border border-[#dbe0ed] bg-white px-4 py-2">
        <div className="flex items-center gap-3">
          <img
            src={iconLink}
            alt=""
            className="size-[22px] shrink-0"
            aria-hidden="true"
          />
          <input
            type="text"
            value={jobOfferInput}
            onChange={(e) => setJobOfferInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Paste a vacancy link or job description"
            className="min-w-0 flex-1 bg-transparent font-normal text-[15px] text-[#8c96b2] outline-none placeholder-[#8c96b2]"
          />
        </div>
        <button
          onClick={handleAnalyze}
          className="shrink-0 rounded-[12px] bg-[#090a12] px-6 py-2.5 font-semibold text-[15px] text-white shadow-[0px_4px_12px_-4px_rgba(0,0,0,0.12)] hover:opacity-90 transition-opacity"
        >
          Analyze
        </button>
      </div>
    </section>
  )
}
