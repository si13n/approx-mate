import type { Translation } from "../../i18n/translations"
import { Button } from "../ui/Button"

interface RecruiterMessageProps {
  message: string
  copied: boolean
  onCopy: () => void
  t: Translation
}

export function RecruiterMessage({
  message,
  copied,
  onCopy,
  t,
}: RecruiterMessageProps) {
  return (
    <section
      className="flex flex-col gap-2.5 rounded-card border border-border bg-surface p-4 tablet:flex-row tablet:items-center tablet:justify-between"
      aria-labelledby="recruiter-title"
    >
      <div className="min-w-0">
        <h3
          id="recruiter-title"
          className="mb-1 font-display text-sm font-semibold"
        >
          {t.recruiterTitle}
        </h3>
        <p className="text-xs leading-[17px] text-content-secondary">
          {message}
        </p>
      </div>
      <Button
        variant="ghost"
        onClick={onCopy}
        className="w-full shrink-0 bg-primary-subtle tablet:w-auto"
        aria-live="polite"
      >
        {copied ? t.copied : t.copyMessage}
      </Button>
    </section>
  )
}
