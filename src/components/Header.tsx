import type { Lang } from "../types"
import type { Translation } from "../i18n/translations"

interface HeaderProps {
  lang: Lang
  onLanguageChange: (lang: Lang) => void
  onHome: () => void
  t: Translation
  activePage?: "calculator" | "job-xray" | "compare" | "how-it-works" | "about"
}

export function Header({
  lang,
  onLanguageChange,
  onHome,
  t,
  activePage,
}: HeaderProps) {
  const navItems = [
    { href: "/calculator", label: "Calculator", id: "calculator" },
    { href: "/job-xray", label: "Job X-RAY", id: "job-xray" },
    { href: "/compare", label: "Compare Offers", id: "compare" },
    { href: "/how-it-works", label: "How it works", id: "how-it-works" },
    { href: "/about", label: "About", id: "about" },
  ]

  return (
    <header className="flex min-h-11 items-center justify-between gap-4 flex-wrap tablet:flex-nowrap">
      <a
        href="/"
        onClick={(event) => {
          if (
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          )
            return
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

      <nav className="hidden items-center gap-6 md:flex">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`text-sm font-medium transition-opacity hover:opacity-75 ${
              activePage === item.id
                ? "border-b-2 border-primary text-content"
                : "text-content-secondary"
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-4 md:gap-6">
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

        <button
          className="flex size-9 items-center justify-center rounded-full bg-content hover:opacity-75 transition-opacity"
          aria-label="Toggle dark mode"
        >
          <span className="text-content-inverse text-lg">🌙</span>
        </button>
      </div>
    </header>
  )
}
