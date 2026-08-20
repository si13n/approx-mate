function gtag(...args: any[]): void {
  if (typeof window.gtag === "function") {
    window.gtag(...args);
  }
}

export function trackPageView(): void {
  gtag("event", "page_view");
}

export function trackCalculatorUsed(): void {
  gtag("event", "calculator_used");
}

export function trackModeChanged(mode: "net" | "gross"): void {
  gtag("event", "mode_changed", { mode });
}

export function trackCurrencyChanged(currency: "USD" | "EUR" | "PLN"): void {
  gtag("event", "currency_changed", { currency });
}

export function trackHoursChanged(): void {
  gtag("event", "hours_changed");
}

export function trackLanguageChanged(language: "en" | "pl" | "ua"): void {
  const langMap = { en: "EN", pl: "PL", ua: "UA" };
  gtag("event", "language_changed", { language: langMap[language] });
}

export function trackRecruiterMessageCopy(): void {
  gtag("event", "recruiter_message_copy");
}

export function trackQuickScenarioClick(scenario: string): void {
  gtag("event", "quick_scenario_click", { scenario });
}

export function trackFeedbackClick(): void {
  gtag("event", "feedback_click");
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}
