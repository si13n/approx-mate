import { useState, type FormEvent } from "react"
import { Footer } from "../components/Footer"
import { Header } from "../components/Header"
import { Button } from "../components/ui/Button"
import { translations } from "../i18n/translations"
import { trackLanguageChanged } from "../lib/analytics"
import type { Lang } from "../types"

export function JobXRayPage() {
  const [lang, setLang] = useState<Lang>("en")
  const [jobSource, setJobSource] = useState("")
  const t = translations[lang]

  const handleAnalyze = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <div className="flex min-h-[max(100vh,713px)] flex-col overflow-hidden bg-page pb-[25px] text-content desktop:min-h-[max(100vh,938px)] desktop:pb-[46px]">
      <Header
        lang={lang}
        t={t}
        activePage="job-xray"
        onHome={() => {
          window.location.href = "/"
        }}
        onLanguageChange={(nextLang) => {
          setLang(nextLang)
          trackLanguageChanged(nextLang)
        }}
      />

      <main className="mx-auto w-[calc(100%-48px)] max-w-[1296px] flex-1 desktop:w-[calc(100%-144px)] desktop:px-6">
        <section
          className="pt-8 desktop:pt-11"
          aria-labelledby="job-xray-heading"
        >
          <h1
            id="job-xray-heading"
            className="font-display text-[28px] font-bold leading-10 text-text-primary desktop:text-[40px] desktop:font-extrabold desktop:leading-12 desktop:tracking-[-1px]"
          >
            <span className="desktop:hidden">{t.jobXRayHeadlineShort}</span>
            <span className="hidden desktop:inline">{t.jobXRayHeadline}</span>
          </h1>

          <form
            className="mt-5 flex h-[72px] items-center gap-2 rounded-2xl border border-border-subtle bg-surface py-2.5 pl-3.5 pr-2.5 desktop:mt-6 desktop:h-[76px] desktop:py-3 desktop:pl-5 desktop:pr-3"
            onSubmit={handleAnalyze}
          >
            <label className="sr-only" htmlFor="job-xray-source">
              {t.vacancyPlaceholder}
            </label>
            <input
              id="job-xray-source"
              type="text"
              value={jobSource}
              onChange={(event) => setJobSource(event.target.value)}
              placeholder={t.vacancyPlaceholder}
              className="min-w-0 flex-1 bg-transparent text-[13px] leading-5 text-text-primary outline-none placeholder:text-text-secondary desktop:text-[15px]"
            />
            <Button
              type="submit"
              variant="dark"
              size="sm"
              style={{ fontWeight: 400 }}
              className="shrink-0 rounded-[10px] desktop:min-h-10 desktop:rounded-xl desktop:px-4 desktop:text-[15px]"
            >
              <span aria-hidden="true">✦</span>
              <span className="desktop:hidden">{t.analyzeOfferShort}</span>
              <span className="hidden desktop:inline">{t.analyzeOffer}</span>
            </Button>
          </form>
        </section>
      </main>

      <Footer t={t} />
    </div>
  )
}
