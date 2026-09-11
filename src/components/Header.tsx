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
  const navItems = [
    { href: "/calculator", label: "Calculator", id: "calculator" },
    { href: "/job-xray", label: "Job X-RAY", id: "job-xray" },
    { href: "/compare", label: "Compare Offers", id: "compare" },
    { href: "/how-it-works", label: "How it works", id: "how-it-works" },
    { href: "/about", label: "About", id: "about" },
  ]

  return (
    <header className="flex h-14 items-center justify-between bg-white">
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
        className="flex items-center gap-3"
      >
        <img
          src={logoMark}
          alt="ApproxMate"
          className="size-8"
        />
        <span className="font-display text-[22px] font-extrabold tracking-[-0.8px] text-[#090a12]">
          ApproxMate
        </span>
      </a>

      {/* Navigation */}
      <nav className="hidden items-center gap-9 md:flex">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`font-medium text-[14px] tracking-[-0.1px] decoration-dotted underline transition-colors ${
              activePage === item.id
                ? "text-[#443b8f]"
                : "text-[#090a12]"
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Header Actions */}
      <div className="flex items-center gap-6">
        <label className="sr-only" htmlFor="language-select">
          {t.language}
        </label>
        <span className="font-medium text-[14px] tracking-[-0.1px] text-[#090a12]">
          {lang.toUpperCase()}
        </span>

        <button
          className="flex size-9 items-center justify-center rounded-full bg-[#090a12]"
          aria-label="Toggle dark mode"
        >
          <img
            src={iconMoon}
            alt=""
            className="size-[18px]"
          />
        </button>
      </div>
    </header>
  )
}
