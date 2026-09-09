import type { Lang } from "../types"
import type { Translation } from "../i18n/translations"

interface HeaderProps {
  lang: Lang
  onLanguageChange: (lang: Lang) => void
  onHome: () => void
  t: Translation
}

export function Header({ lang, onLanguageChange, onHome, t }: HeaderProps) {
  return (
    <header
      className="flex min-h-11 items-center justify-between"
      aria-label="ApproxMate"
    >
      <a
        href="/"
        onClick={(event) => {
          if (
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          ) return
          event.preventDefault()
          onHome()
        }}
        className="flex items-center gap-2 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary tablet:gap-2.5"
      >
        <div
          className="flex size-10 items-center justify-center rounded-[10px] bg-primary font-display text-xl font-bold text-content-inverse tablet:size-[45px] tablet:rounded-xl tablet:text-[26px]"
          aria-hidden="true"
        >
          ≈
        </div>
        <span className="font-display text-lg font-bold tablet:text-xl">
          approxmate
        </span>
      </a>
      <label className="sr-only" htmlFor="language-select">
        {t.language}
      </label>
      <select
        id="language-select"
        value={lang}
        onChange={(event) => onLanguageChange(event.target.value as Lang)}
        className="min-h-8 rounded-full border-0 bg-surface-subtle px-2.5 text-[11px] font-semibold uppercase text-content-secondary outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <option value="en">EN</option>
        <option value="pl">PL</option>
        <option value="ua">UA</option>
      </select>
    </header>
  )
}
