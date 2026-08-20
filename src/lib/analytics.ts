const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

function isGAEnabled(): boolean {
  return !!GA_MEASUREMENT_ID;
}

function gtag(...args: any[]): void {
  if (!isGAEnabled()) return;
  if (typeof window.gtag === "function") {
    window.gtag(...args);
  }
}

export function initializeGA(): void {
  if (!isGAEnabled()) {
    console.log("[Analytics] GA4 disabled - VITE_GA_MEASUREMENT_ID not set");
    return;
  }
  console.log("[Analytics] GA4 initialized with measurement ID:", GA_MEASUREMENT_ID);
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
