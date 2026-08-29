import type { Lang } from "../types"
import type { Translation } from "../i18n/translations"

interface HeaderProps {
  lang: Lang
  onLanguageChange: (lang: Lang) => void
  t: Translation
}

export function Header({ lang, onLanguageChange, t }: HeaderProps) {
  return (
    <header
      className="flex min-h-11 items-center justify-between"
      aria-label="ApproxMate"
    >
      <div className="flex items-center gap-2 tablet:gap-2.5">
        <div
          className="flex size-10 items-center justify-center rounded-[10px] bg-primary font-display text-xl font-bold text-content-inverse tablet:size-[45px] tablet:rounded-xl tablet:text-[26px]"
          aria-hidden="true"
        >
          ≈
        </div>
        <span className="font-display text-lg font-bold tablet:text-xl">
          approxmate
        </span>
      </div>
      <label className="sr-only" htmlFor="language-select">
        {t.language}
      </label>
      <select
        id="language-select"
        value={lang}
        onChange={(event) => onLanguageChange(event.target.value as Lang)}
        className="min-h-11 rounded-full border-0 bg-surface-subtle px-3 text-xs font-semibold uppercase text-content-secondary outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <option value="en">EN</option>
        <option value="pl">PL</option>
        <option value="ua">UA</option>
      </select>
    </header>
  )
}
