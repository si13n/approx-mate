import { trackFeedbackClick } from "../lib/analytics"
import type { Translation } from "../i18n/translations"

export function Footer({ t }: { t: Translation }) {
  return (
    <footer className="flex min-h-[52px] flex-col items-center justify-center gap-1 text-xs text-content-secondary">
      <span>ApproxMate 2026</span>
      <a
        href="mailto:si13n@yahoo.com"
        onClick={trackFeedbackClick}
        className="underline underline-offset-2 hover:text-content focus-visible:outline-2 focus-visible:outline-primary"
      >
        {t.sendFeedback}
      </a>
    </footer>
  )
}
