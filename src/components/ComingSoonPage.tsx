import { Footer } from "./Footer"
import { translations } from "../i18n/translations"

export function ComingSoonPage() {
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <div className="flex flex-1 items-center justify-center text-center">
        <div>
          <h1 className="text-3xl font-bold text-content mb-4">Coming Soon</h1>
          <p className="text-content-secondary mb-6">
            This page is under development.
          </p>
          <button
            onClick={() => {
              window.location.href = "/"
            }}
            className="px-6 py-3 bg-primary text-content-inverse rounded-lg hover:opacity-90 transition-opacity"
          >
            Back to Home
          </button>
        </div>
      </div>
      <Footer t={translations.en} />
    </div>
  )
}
