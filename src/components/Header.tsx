import { useState } from "react"
import type { Lang } from "../types"
import type { Translation } from "../i18n/translations"
import logoMark from "../assets/new-homepage/logo-mark.svg"
import iconMoon from "../assets/new-homepage/icon-moon.svg"

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
  const [mobileOpen, setMobileOpen] = useState(false)
  const navItems = [
    { href: "/calculator", label: "Calculator", id: "calculator" },
    { href: "/job-xray", label: "Job X-RAY", id: "job-xray" },
    { href: "/compare", label: "Compare Offers", id: "compare" },
    { href: "/how-it-works", label: "How it works", id: "how-it-works" },
    { href: "/about", label: "About", id: "about" },
  ]

  return (
    <header className="relative z-30 flex h-14 items-center justify-between bg-transparent">
      {/* Brand */}
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
        className="flex items-center gap-2 desktop:gap-3"
      >
        <img
          src={logoMark}
          alt="ApproxMate"
          className="size-6 desktop:size-8"
        />
        <span className="font-display text-base font-extrabold tracking-[-0.6px] text-text-primary desktop:text-[22px] desktop:tracking-[-0.8px]">
          ApproxMate
        </span>
      </a>

      {/* Navigation */}
      <nav className="hidden items-center gap-9 desktop:flex">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`text-[14px] font-medium tracking-[-0.1px] underline decoration-dotted underline-offset-4 transition-colors ${
              activePage === item.id ? "text-[#443b8f]" : "text-text-primary"
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Header Actions */}
      <div className="flex items-center gap-4 desktop:gap-6">
        <label className="sr-only" htmlFor="language-select">
          {t.language}
        </label>
        <select
          id="language-select"
          value={lang}
          onChange={(event) => onLanguageChange(event.target.value as Lang)}
          className="appearance-none bg-transparent text-[13px] font-medium tracking-[-0.1px] text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary desktop:text-[14px]"
        >
          <option value="en">EN</option>
          <option value="pl">PL</option>
          <option value="ua">UA</option>
        </select>

        <button
          className="hidden size-9 items-center justify-center rounded-full bg-action-primary desktop:flex"
          aria-label="Toggle dark mode"
        >
          <img src={iconMoon} alt="" className="size-[18px]" />
        </button>
        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-full bg-action-primary desktop:hidden"
          aria-label="Open navigation"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span className="flex w-3.5 flex-col gap-1" aria-hidden="true">
            <span className="h-px w-full bg-white" />
            <span className="h-px w-full bg-white" />
          </span>
        </button>
      </div>

      {mobileOpen && (
        <nav className="absolute right-0 top-14 flex min-w-52 flex-col gap-1 rounded-2xl border border-border-subtle bg-white p-2 shadow-[0_16px_40px_rgba(55,65,110,0.14)] desktop:hidden">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`rounded-xl px-4 py-3 text-sm font-medium ${
                activePage === item.id
                  ? "bg-primary-subtle text-[#443b8f]"
                  : "text-text-primary"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
