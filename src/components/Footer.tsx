import { trackFeedbackClick } from "../lib/analytics"
import type { Translation } from "../i18n/translations"

export function Footer({ t }: { t: Translation }) {
  return (
    <footer className="mx-auto flex h-16 w-[calc(100%-48px)] max-w-[1248px] shrink-0 items-center justify-center gap-6 text-[11px] font-normal leading-4 text-text-muted desktop:w-[calc(100%-192px)]">
      <span>ApproxMate 2026</span>
      <a
        href="mailto:si13n@yahoo.com"
        onClick={trackFeedbackClick}
        className="text-text-secondary underline decoration-dotted underline-offset-2 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-primary"
      >
        {t.sendFeedback}
      </a>
    </footer>
  )
}
