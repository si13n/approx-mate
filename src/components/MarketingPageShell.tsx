import { useState, type ReactNode } from "react"
import { translations } from "../i18n/translations"
import { trackLanguageChanged } from "../lib/analytics"
import type { Lang } from "../types"
import { Footer } from "./Footer"
import { Header } from "./Header"

type MarketingPage = "how-it-works" | "about"

export function MarketingPageShell({
  activePage,
  children,
}: {
  activePage: MarketingPage
  children: ReactNode
}) {
  const [lang, setLang] = useState<Lang>("en")
  const t = translations[lang]

  return (
    <div className="static-page">
      <Header
        lang={lang}
        t={t}
        activePage={activePage}
        onHome={() => {
          window.location.href = "/"
        }}
        onLanguageChange={(nextLang) => {
          setLang(nextLang)
          trackLanguageChanged(nextLang)
        }}
      />
      {children}
      <Footer t={t} />
    </div>
  )
}
