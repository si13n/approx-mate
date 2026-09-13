import { useEffect, useRef, useState } from "react"
import type { Lang } from "../types"
import type { Translation } from "../i18n/translations"
import logoMark from "../assets/new-homepage/logo-mark.svg"

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
  const mobileMenuRef = useRef<HTMLElement>(null)
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null)
  const navItems = [
    { href: "/calculator", label: "Calculator", id: "calculator" },
    { href: "/job-xray", label: "Job X-RAY", id: "job-xray" },
    { href: "/compare", label: "Compare Offers", id: "compare" },
    { href: "/how-it-works", label: "How it works", id: "how-it-works" },
    { href: "/about", label: "About", id: "about" },
  ]

  useEffect(() => {
    if (!mobileOpen) return

    const closeOnOutsideClick = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (
        mobileMenuRef.current?.contains(target) ||
        mobileMenuButtonRef.current?.contains(target)
      )
        return

      setMobileOpen(false)
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false)
        mobileMenuButtonRef.current?.focus()
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick)
    document.addEventListener("keydown", closeOnEscape)

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick)
      document.removeEventListener("keydown", closeOnEscape)
    }
  }, [mobileOpen])

  return (
    <header className="relative z-30 mx-auto mt-4 flex h-11 w-[calc(100%-48px)] max-w-[1296px] items-center justify-between bg-transparent desktop:mt-6 desktop:h-14 desktop:w-[calc(100%-144px)]">
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
        className="flex items-center gap-[9px] desktop:gap-3"
      >
        <img
          src={logoMark}
          alt="ApproxMate"
          className="h-6 w-7 desktop:h-7 desktop:w-8"
        />
        <span className="font-display text-[18px] font-extrabold leading-6 tracking-[-0.6px] text-text-primary desktop:text-[22px] desktop:leading-7 desktop:tracking-[-0.8px]">
          ApproxMate
        </span>
      </a>

      {/* Navigation */}
      <nav className="hidden items-center gap-9 desktop:flex">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            aria-current={activePage === item.id ? "page" : undefined}
            className={`text-[14px] font-medium leading-5 tracking-[-0.1px] transition-colors hover:text-accent-purple ${
              activePage === item.id
                ? "text-accent-purple underline decoration-solid underline-offset-2"
                : "text-text-primary no-underline"
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Header Actions */}
      <div className="flex items-center gap-[14px] desktop:gap-6">
        <label className="sr-only" htmlFor="language-select">
          {t.language}
        </label>
        <select
          id="language-select"
          value={lang}
          onChange={(event) => onLanguageChange(event.target.value as Lang)}
          className="appearance-none bg-transparent text-[14px] font-medium tracking-[-0.1px] text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <option value="en">EN</option>
          <option value="pl">PL</option>
          <option value="ua">UA</option>
        </select>

        <button
          ref={mobileMenuButtonRef}
          type="button"
          className="flex size-9 items-center justify-center rounded-full bg-action-primary desktop:hidden"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span className="flex w-3.5 flex-col gap-1" aria-hidden="true">
            <span className="h-px w-full bg-white" />
            <span className="h-px w-full bg-white" />
          </span>
        </button>
      </div>

      {mobileOpen && (
        <nav
          ref={mobileMenuRef}
          id="mobile-navigation"
          className="absolute right-0 top-12 flex min-w-52 flex-col gap-1 rounded-2xl border border-border-subtle bg-white p-2 shadow-[0_16px_40px_rgba(55,65,110,0.14)] desktop:hidden"
        >
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
