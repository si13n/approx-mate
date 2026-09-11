import type { Translation } from "../../i18n/translations"

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
      className="flex flex-col gap-2 rounded-[16px] bg-[#f2f1f4] p-4 tablet:flex-row tablet:items-start tablet:justify-between"
      aria-labelledby="recruiter-title"
    >
      <div className="min-w-0">
        <h3
          id="recruiter-title"
          className="mb-1 font-display text-sm font-medium text-text-primary"
        >
          {t.recruiterTitle}
        </h3>
        <p className="text-xs leading-[17px] text-text-secondary">{message}</p>
      </div>
      <button
        type="button"
        onClick={onCopy}
        className="w-fit shrink-0 border-b border-dashed border-current text-xs font-normal text-text-primary hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        aria-live="polite"
      >
        {copied ? t.copied : t.copyMessage}
      </button>
    </section>
  )
}
