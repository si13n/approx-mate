function gtag(...args: unknown[]): void {
  if (typeof window.gtag === "function") {
    window.gtag(...args)
  }
}

export function trackPageView(): void {
  gtag("event", "page_view")
}

export function trackCalculatorUsed(): void {
  gtag("event", "calculator_used")
}

export function trackModeChanged(mode: "net" | "gross"): void {
  gtag("event", "mode_changed", { mode })
}

export function trackCurrencyChanged(currency: "USD" | "EUR" | "PLN"): void {
  gtag("event", "currency_changed", { currency })
}

export function trackHoursChanged(): void {
  gtag("event", "hours_changed")
}

export function trackLanguageChanged(language: "en" | "pl" | "ua"): void {
  const langMap = { en: "EN", pl: "PL", ua: "UA" }
  gtag("event", "language_changed", { language: langMap[language] })
}

export function trackRecruiterMessageCopy(): void {
  gtag("event", "recruiter_message_copy")
}

export function trackQuickScenarioClick(scenario: string): void {
  gtag("event", "quick_scenario_click", { scenario })
}

export function trackFeedbackClick(): void {
  gtag("event", "feedback_click")
}

export function trackTaxProfileOpen(): void {
  gtag("event", "tax_profile_open")
}

export function trackB2BRateChanged(rate: number): void {
  gtag("event", "b2b_rate_changed", { rate: Math.round(rate * 100) })
}

export function trackB2BZUSChanged(zus: string): void {
  gtag("event", "b2b_zus_changed", { zus })
}

export function trackB2BSicknessChanged(enabled: boolean): void {
  gtag("event", "b2b_sickness_changed", { enabled })
}

export function trackUoPKUPChanged(kupType: string): void {
  gtag("event", "uop_kup_changed", { kup_type: kupType })
}

export function trackUoPPPKChanged(enabled: boolean): void {
  gtag("event", "uop_ppk_changed", { enabled })
}

export function trackTaxProfileReset(): void {
  gtag("event", "tax_profile_reset")
}

export function trackJobAnalysisStarted(sourceType: "url" | "text"): void {
  gtag("event", "job_analysis_started", { source_type: sourceType })
}

export function trackJobAnalysisCompleted(
  sourceType: "url" | "text",
  extractedFields: number,
): void {
  gtag("event", "job_analysis_completed", {
    source_type: sourceType,
    extracted_fields: extractedFields,
  })
}

export function trackJobAnalysisFailed(errorCode: string): void {
  gtag("event", "job_analysis_failed", { error_code: errorCode })
}

export function trackOfferTabOpened(): void {
  gtag("event", "offer_tab_opened")
}

export function trackOfferTabClosed(): void {
  gtag("event", "offer_tab_closed")
}

export function trackOfferCompareClicked(): void {
  gtag("event", "offer_compare_clicked")
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}
