import { useState } from "react"
import { Footer } from "./Footer"
import { Header } from "./Header"
import { translations } from "../i18n/translations"
import { trackLanguageChanged } from "../lib/analytics"
import type { Lang } from "../types"

type ComingSoonPageProps = {
  activePage: "compare" | "how-it-works" | "about"
}

export function ComingSoonPage({ activePage }: ComingSoonPageProps) {
  const [lang, setLang] = useState<Lang>("en")
  const t = translations[lang]

  return (
    <div className="flex min-h-screen flex-col bg-page">
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
      <main className="flex flex-1 items-center justify-center px-6 text-center">
        <div>
          <h1 className="mb-4 text-3xl font-bold text-content">Coming Soon</h1>
          <p className="mb-6 text-content-secondary">
            This page is under development.
          </p>
          <button
            onClick={() => {
              window.location.href = "/"
            }}
            className="rounded-lg bg-primary px-6 py-3 text-content-inverse transition-opacity hover:opacity-90"
          >
            Back to Home
          </button>
        </div>
      </main>
      <Footer t={t} />
    </div>
  )
}
