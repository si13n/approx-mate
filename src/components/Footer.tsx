import { trackFeedbackClick } from "../lib/analytics"
import type { Translation } from "../i18n/translations"

export function Footer({ t }: { t: Translation }) {
  return (
    <footer className="flex min-h-[52px] items-center justify-center gap-5 text-[11px] text-text-muted">
      <span>ApproxMate 2026</span>
      <a
        href="mailto:si13n@yahoo.com"
        onClick={trackFeedbackClick}
        className="underline decoration-dotted underline-offset-2 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-primary"
      >
        {t.sendFeedback}
      </a>
    </footer>
  )
}
