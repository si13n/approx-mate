import { useRef, useState, type FormEvent } from "react"
import type { Translation } from "../../../i18n/translations"
import {
  trackJobAnalysisCompleted,
  trackJobAnalysisFailed,
  trackJobAnalysisStarted,
} from "../../../lib/analytics"
import { Button } from "../../../components/ui/Button"
import { analyzeJobInput, JobAnalysisClientError } from "../jobAnalysisClient"
import { jobXRayIcons } from "../icons"
import type { JobAnalysis } from "../types"

interface JobXRayPanelProps {
  t: Translation
  offerCount: number
  onAnalyze: (analysis: JobAnalysis, originalInput: string) => void
}

export function JobXRayPanel({ t, offerCount, onAnalyze }: JobXRayPanelProps) {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const atLimit = offerCount >= 3

  const resizeInput = () => {
    const element = inputRef.current
    if (!element) return
    element.style.height = "46px"
    element.style.height = `${Math.min(element.scrollHeight, 128)}px`
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (loading || atLimit) return
    setError(null)
    setLoading(true)
    const sourceType = /^https?:\/\//i.test(input.trim()) ? "url" : "text"
    trackJobAnalysisStarted(sourceType)
    try {
      const analysis = await analyzeJobInput(input)
      const extractedFields = [
        analysis.title.value,
        analysis.company.value,
        analysis.location.value,
        analysis.workMode.value,
        analysis.officeDaysPerWeek.value,
        analysis.contractTypes.value?.length,
        analysis.salary.value,
        analysis.seniority.value,
        analysis.experience.value,
        analysis.english.value,
        analysis.requiredSkills.value?.length,
        analysis.responsibilities.value?.length,
        analysis.niceToHave.value?.length,
        analysis.benefits.value?.length,
      ].filter(Boolean).length
      trackJobAnalysisCompleted(sourceType, extractedFields)
      onAnalyze(analysis, input.trim())
      setInput("")
      requestAnimationFrame(resizeInput)
    } catch (caught) {
      const code =
        caught instanceof JobAnalysisClientError ? caught.code : "PARSE_FAILED"
      trackJobAnalysisFailed(code)
      setError(
        code === "FETCH_BLOCKED" || code === "NO_JOB_CONTENT"
          ? t.jobAnalysisPasteFallback
          : code === "CONTENT_TOO_LARGE"
            ? t.jobAnalysisTooLarge
            : t.jobAnalysisInvalid,
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      className="rounded-panel border border-border bg-surface px-4 py-4 desktop:px-6"
      aria-labelledby="job-xray-title"
    >
      <p className="text-xs font-semibold tracking-[0.08em] text-content-secondary">
        {t.jobXRay}
      </p>
      <h2
        id="job-xray-title"
        className="mt-1 font-display text-[22px] font-semibold"
      >
        {t.analyzeAnyVacancy}
      </h2>
      <form
        className="mt-2 flex flex-col gap-2"
        onSubmit={(event) => void submit(event)}
      >
        <label htmlFor="job-xray-input" className="sr-only">
          {t.vacancyPlaceholder}
        </label>
        <textarea
          ref={inputRef}
          id="job-xray-input"
          rows={1}
          maxLength={100_000}
          value={input}
          disabled={loading || atLimit}
          placeholder={t.vacancyPlaceholder}
          onChange={(event) => {
            setInput(event.target.value)
            setError(null)
            requestAnimationFrame(resizeInput)
          }}
          className="min-h-[46px] max-h-32 resize-none overflow-y-auto rounded-xl border border-border-strong bg-surface-subtle px-3.5 py-3 text-sm leading-5 outline-none placeholder:text-content-secondary/70 focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60"
          aria-describedby={error ? "job-xray-error" : undefined}
        />
        <Button
          type="submit"
          loading={loading}
          disabled={!input.trim() || atLimit}
          leadingIcon={
            <img
              src={jobXRayIcons.sparkles}
              alt=""
              aria-hidden="true"
              className="size-4"
            />
          }
          className="w-full rounded-xl text-sm"
        >
          {loading ? t.analyzingOffer : t.analyzeOffer}
        </Button>
      </form>
      {(error || atLimit) && (
        <div className="mt-2 text-xs">
          {error ? (
            <p id="job-xray-error" role="alert" className="text-danger">
              {error}
            </p>
          ) : (
            <p role="status" className="font-medium text-content-secondary">
              {t.jobAnalysisLimit}
            </p>
          )}
        </div>
      )}
    </section>
  )
}
