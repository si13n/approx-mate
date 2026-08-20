import { useState, useMemo, useEffect } from "react";
import { trackPageView, trackCalculatorUsed, trackModeChanged, trackCurrencyChanged, trackLanguageChanged, trackRecruiterMessageCopy, trackQuickScenarioClick, trackFeedbackClick, trackTaxProfileOpen } from "./lib/analytics";
import { useTaxProfile } from "./lib/useTaxProfile";
import { TaxProfileDisplay } from "./components/TaxProfileDisplay";
import { B2BSettingsModal } from "./components/B2BSettingsModal";
import { UoPSettingsModal } from "./components/UoPSettingsModal";

// ── i18n ───────────────────────────────────────────────────────────────────
type Lang = "en" | "pl" | "ua";

const T = {
  en: {
    title: "Salary Calculator",
    gross: "Gross",
    net: "Net",
    grossDesc: "I know the offered gross",
    netDesc: "I know my desired take-home",
    invoice: "Invoice (gross)",
    brutto: "Gross (brutto)",
    takeHome: "Take-home",
    perMonth: "/mo",
    perHour: "/h",
    hoursPerMonth: "h / month",
    ifB2B: "If B2B",
    ifUoP: "If UoP",
    needToInvoice: "Need to invoice",
    needGross: "Need gross",
    quickScenarios: "Quick scenarios",
    recruiterTitle: "Message for recruiter",
    recruiterCopy: "Copy",
    recruiterCopied: "Copied!",
    feedback: "Send feedback",
    disclaimer: "ApproxMate · Poland 2026",
  },
  pl: {
    title: "Kalkulator wynagrodzeń",
    gross: "Brutto",
    net: "Netto",
    grossDesc: "Znam oferowane brutto",
    netDesc: "Znam oczekiwane netto",
    invoice: "Faktura (brutto)",
    brutto: "Brutto",
    takeHome: "Na rękę",
    perMonth: "/mies",
    perHour: "/h",
    hoursPerMonth: "godz / miesiąc",
    ifB2B: "Jeśli B2B",
    ifUoP: "Jeśli UoP",
    needToInvoice: "Musisz fakturować",
    needGross: "Potrzebujesz brutto",
    quickScenarios: "Szybkie scenariusze",
    recruiterTitle: "Wiadomość dla rekrutera",
    recruiterCopy: "Kopiuj",
    recruiterCopied: "Skopiowano!",
    feedback: "Prześlij opinię",
    disclaimer: "ApproxMate · Poland 2026",
  },
  ua: {
    title: "Калькулятор зарплати",
    gross: "Брутто",
    net: "Нетто",
    grossDesc: "Знаю запропоноване брутто",
    netDesc: "Знаю бажане нетто",
    invoice: "Рахунок (брутто)",
    brutto: "Брутто",
    takeHome: "На руки",
    perMonth: "/міс",
    perHour: "/год",
    hoursPerMonth: "год / місяць",
    ifB2B: "Якщо B2B",
    ifUoP: "Якщо UoP",
    needToInvoice: "Треба виставити",
    needGross: "Треба брутто",
    quickScenarios: "Швидкі сценарії",
    recruiterTitle: "Повідомлення для рекрутера",
    recruiterCopy: "Копіювати",
    recruiterCopied: "Скопійовано!",
    feedback: "Зворотній зв'язок",
    disclaimer: "ApproxMate · Poland 2026",
  },
};

// ── Types ──────────────────────────────────────────────────────────────────
type Currency = "PLN" | "USD" | "EUR";
type InputType = "gross" | "net";

// ── Exchange rates ─────────────────────────────────────────────────────────
const RATES: Record<string, number> = { PLN_PLN: 1, USD_PLN: 3.85, EUR_PLN: 4.25 };
const RATES_UPDATED_AT = new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
function toPLN(a: number, from: Currency) { return a * (RATES[`${from}_PLN`] ?? 1); }
function fromPLN(a: number, to: Currency) { return a / (RATES[`${to}_PLN`] ?? 1); }

// ── Tax calculations (delegated to configurable engine) ────────────────────
import { calculateB2BFromGross, calculateB2BFromNet, calculateUoPFromGross, calculateUoPFromNet } from "./lib/taxCalculations";

// ── Formatters ─────────────────────────────────────────────────────────────
const SYM: Record<Currency, string> = { USD: "$", EUR: "€", PLN: "" };
const SUF: Record<Currency, string> = { USD: "", EUR: "", PLN: " PLN" };

function fmt(amount: number, currency: Currency, dec = 0): string {
  const n = Math.round(amount * 10 ** dec) / 10 ** dec;
  return `${SYM[currency]}${n.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec })}${SUF[currency]}`;
}

// ── SalaryCard ─────────────────────────────────────────────────────────────
function SalaryCard({
  label,
  grossPLN,
  netPLN,
  currency,
  inputType,
  hoursPerMonth,
  isB2B,
  t,
}: {
  label: string;
  grossPLN: number;
  netPLN: number;
  currency: Currency;
  inputType: InputType;
  hoursPerMonth: number;
  isB2B: boolean;
  t: typeof T["en"];
}) {
  const primaryPLN = inputType === "net" ? grossPLN : netPLN;
  const secondaryPLN = inputType === "net" ? netPLN : grossPLN;
  const primaryLabel = inputType === "net" ? (isB2B ? t.invoice : t.brutto) : t.takeHome;
  const secondaryLabel = inputType === "net" ? t.takeHome : (isB2B ? t.invoice : t.brutto);
  const hourlyPrimaryPLN = primaryPLN / hoursPerMonth;
  const hourlySecPLN = secondaryPLN / hoursPerMonth;

  const ALL: Currency[] = ["USD", "EUR", "PLN"];
  const others = ALL.filter((c) => c !== currency);

  function allCurrencies(plnVal: number, dec = 0) {
    return others.map((c) => fmt(fromPLN(plnVal, c), c, dec)).join(" · ");
  }

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3"
      style={{ background: "#fff", border: "1px solid var(--color-border)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
    >
      {/* Header */}
      <span
        className="text-xs font-semibold px-2 py-0.5 rounded-full self-start"
        style={{
          background: isB2B ? "rgba(59,130,246,0.1)" : "rgba(6,182,212,0.1)",
          color: isB2B ? "#2563EB" : "#0891B2",
        }}
      >
        {label}
      </span>

      {/* Primary value */}
      <div>
        <div className="text-xs font-medium mb-1" style={{ color: "var(--color-muted-foreground)" }}>
          {primaryLabel}
        </div>
        <div
          className="font-bold tabular-nums leading-none"
          style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--color-foreground)", letterSpacing: "-0.03em" }}
        >
          {fmt(fromPLN(primaryPLN, currency), currency)}
          <span className="text-sm font-medium ml-1" style={{ color: "var(--color-muted-foreground)" }}>
            {t.perMonth}
          </span>
        </div>
        <div className="text-xs tabular-nums mt-1 leading-relaxed" style={{ color: "var(--color-muted-foreground)" }}>
          {allCurrencies(primaryPLN)}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "var(--color-border)" }} />

      {/* Secondary value */}
      <div>
        <div className="text-xs font-medium mb-0.5" style={{ color: "var(--color-muted-foreground)" }}>
          {secondaryLabel}
        </div>
        <div
          className="font-semibold tabular-nums"
          style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "var(--color-foreground)" }}
        >
          {fmt(fromPLN(secondaryPLN, currency), currency)}
        </div>
        <div className="text-xs tabular-nums mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
          {allCurrencies(secondaryPLN)}
        </div>
      </div>

      {/* Hourly — 2×2 grid */}
      <div className="rounded-xl px-3 py-2.5 grid grid-cols-2 gap-x-3 gap-y-1" style={{ background: "var(--color-muted)" }}>
        {[
          { label: `Gross${t.perHour}`, plnVal: hourlyPrimaryPLN },
          { label: `Net${t.perHour}`, plnVal: hourlySecPLN },
        ].map(({ label, plnVal }) => (
          <div key={label}>
            <div className="text-xs mb-0.5" style={{ color: "var(--color-muted-foreground)" }}>{label}</div>
            <div className="text-sm font-semibold tabular-nums" style={{ fontFamily: "var(--font-display)", color: "var(--color-foreground)" }}>
              {fmt(fromPLN(plnVal, currency), currency, 2)}
            </div>
            {currency !== "PLN" && (
              <div className="text-xs tabular-nums" style={{ color: "var(--color-muted-foreground)" }}>
                {fmt(plnVal, "PLN")}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState<Lang>("en");
  const [inputType, setInputType] = useState<InputType>("net");
  const [rawAmount, setRawAmount] = useState<string>("5000");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [copied, setCopied] = useState(false);
  const [sliderValue, setSliderValue] = useState<number>(5000);
  const hoursPerMonth = 160;

  // Tax profile management
  const { profile, updateProfile, resetToDefaults, isLoaded } = useTaxProfile();
  const [showB2BSettings, setShowB2BSettings] = useState(false);
  const [showUoPSettings, setShowUoPSettings] = useState(false);

  const t = T[lang];
  const amount = parseFloat(rawAmount) || 0;

  useEffect(() => {
    trackPageView();
  }, []);

  useEffect(() => {
    if (amount > 0) {
      trackCalculatorUsed();
    }
  }, [amount]);

  const results = useMemo(() => {
    if (amount <= 0 || !isLoaded) return null;
    const monthlyPLN = toPLN(amount, currency);

    let b2bResult, uopResult;

    if (inputType === "gross") {
      b2bResult = calculateB2BFromGross(monthlyPLN, profile);
      uopResult = calculateUoPFromGross(monthlyPLN, profile);
    } else {
      b2bResult = calculateB2BFromNet(monthlyPLN, profile);
      uopResult = calculateUoPFromNet(monthlyPLN, profile);
    }

    return {
      b2bGrossPLN: b2bResult.monthlyGross,
      b2bNetPLN: b2bResult.monthlyNet,
      uopGrossPLN: uopResult.monthlyGross,
      uopNetPLN: uopResult.monthlyNet,
    };
  }, [amount, currency, inputType, profile, isLoaded]);

  const recruiterMessage = useMemo(() => {
    if (!results || amount <= 0) return "";
    const inputVal = fmt(amount, currency);
    const typeLabel = inputType === "net" ? t.net.toLowerCase() : t.gross.toLowerCase();
    const msgs: Record<Lang, string> = {
      en: `Hi! I'm currently looking at opportunities in the range of around ${inputVal} ${typeLabel} per month, but I'm flexible depending on the project, team, and growth opportunities. Happy to discuss the details and learn more about the role.`,
      pl: `Cześć! Aktualnie szukam oportunności w przedziale około ${inputVal} ${typeLabel} miesięcznie, ale jestem elastyczny/a w zależności od projektu, zespołu i możliwości rozwoju. Chętnie omówię szczegóły i dowiem się więcej o stanowisku.`,
      ua: `Привіт! Шукаю можливості в діапазоні близько ${inputVal} ${typeLabel} на місяць. Розглядаю гнучкість залежно від проєкту, команди та можливостей розвитку. Можемо обговорити деталі щоб дізнатися більше про посаду.`,
    };
    return msgs[lang];
  }, [results, amount, currency, lang, inputType, t]);

  const quickScenarios = [
    { label: "$3k net", amount: 3000, currency: "USD" as Currency, type: "net" as InputType },
    { label: "$4k net", amount: 4000, currency: "USD" as Currency, type: "net" as InputType },
    { label: "$5k net", amount: 5000, currency: "USD" as Currency, type: "net" as InputType },
    { label: "€3.5k net", amount: 3500, currency: "EUR" as Currency, type: "net" as InputType },
    { label: "20k PLN gross", amount: 20000, currency: "PLN" as Currency, type: "gross" as InputType },
  ];

  const currSymbol = SYM[currency];
  const showPLNLabel = currency === "PLN";
  const sliderMax = currency === "PLN" ? 50000 : 10000;
  const sliderCenter = (1000 + sliderMax) / 2;

  return (
    <div className="min-h-screen w-full" style={{ background: "var(--color-background)", fontFamily: "var(--font-body)" }}>
      <div className="max-w-lg mx-auto px-2 py-4 flex flex-col gap-3">

        {/* Brand + lang */}
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2.5 cursor-pointer transition-opacity hover:opacity-75"
            onClick={() => { setLang("en"); setInputType("net"); setRawAmount("5000"); setCurrency("USD"); setSliderValue(5000); setCopied(false); }}
          >
            <div
              className="flex items-center justify-center rounded-xl shrink-0"
              style={{ width: 38, height: 38, background: "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)", boxShadow: "0 2px 8px rgba(59,130,246,0.3)" }}
            >
              <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fff", fontFamily: "var(--font-display)" }}>≈</span>
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 700, color: "var(--color-foreground)", letterSpacing: "-0.02em" }}>
              approxmate
            </span>
          </div>
          <div className="flex gap-0.5 rounded-lg overflow-hidden" style={{ border: "1px solid var(--color-border)", background: "var(--color-card)" }}>
            {(["en", "pl", "ua"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => { setLang(l); trackLanguageChanged(l); }}
                className="px-2.5 py-1.5 text-xs font-semibold uppercase transition-all"
                style={{
                  background: lang === l ? "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)" : "transparent",
                  color: lang === l ? "#fff" : "var(--color-muted-foreground)",
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Main title */}
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", fontWeight: 400, color: "var(--color-foreground)", letterSpacing: "-0.02em", marginBottom: 0.5 }}>
            {t.title}
          </h1>
        </div>

        {/* Tax Profile Display */}
        {isLoaded && (
          <TaxProfileDisplay
            profile={profile}
            onB2BClick={() => { setShowB2BSettings(true); trackTaxProfileOpen(); }}
            onUoPClick={() => { setShowUoPSettings(true); trackTaxProfileOpen(); }}
          />
        )}

        {/* ── INPUT CARD ── */}
        <div
          className="rounded-2xl p-3 flex flex-col gap-3"
          style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
        >
          {/* 1. Gross / Net — primary toggle */}
          <div className="grid grid-cols-2 rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
            {(["net", "gross"] as InputType[]).map((v, i) => (
              <button
                key={v}
                onClick={() => { setInputType(v); trackModeChanged(v); }}
                className="py-3 flex flex-col items-center gap-0.5 transition-all duration-200"
                style={{
                  background: inputType === v ? "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)" : "var(--color-muted)",
                  color: inputType === v ? "#fff" : "var(--color-muted-foreground)",
                  borderLeft: i > 0 ? "1px solid var(--color-border)" : "none",
                }}
              >
                <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 600 }}>
                  {v === "net" ? t.net : t.gross}
                </span>
                <span style={{ fontSize: "0.6875rem", opacity: inputType === v ? 0.8 : 0.6 }}>
                  {v === "net" ? t.netDesc : t.grossDesc}
                </span>
              </button>
            ))}
          </div>

          {/* 2. Amount */}
          <div>
            <div className="relative">
              {!showPLNLabel && (
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 select-none"
                  style={{ fontSize: "1.5rem", fontWeight: 500, color: "var(--color-muted-foreground)", fontFamily: "var(--font-display)" }}
                >
                  {currSymbol}
                </span>
              )}
              <input
                type="number"
                value={rawAmount}
                onChange={(e) => { setRawAmount(e.target.value); setSliderValue(sliderCenter); }}
                placeholder="0"
                className="w-full rounded-xl outline-none transition-all tabular-nums"
                style={{
                  paddingLeft: showPLNLabel ? "1.125rem" : "2.75rem",
                  paddingRight: showPLNLabel ? "4rem" : "1.125rem",
                  paddingTop: "0.875rem",
                  paddingBottom: "0.875rem",
                  fontSize: "2rem",
                  fontWeight: 700,
                  fontFamily: "var(--font-display)",
                  letterSpacing: "-0.03em",
                  background: "var(--color-muted)",
                  border: "2px solid transparent",
                  color: "var(--color-foreground)",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#3B82F6"; e.target.style.background = "#fff"; }}
                onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.background = "var(--color-muted)"; }}
              />
              {showPLNLabel && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base font-semibold select-none" style={{ color: "var(--color-muted-foreground)" }}>
                  PLN
                </span>
              )}
            </div>
          </div>

          {/* 3. Currency */}
          <div className="grid grid-cols-3 rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
            {(["USD", "EUR", "PLN"] as Currency[]).map((c, i) => (
              <button
                key={c}
                onClick={() => { setCurrency(c); trackCurrencyChanged(c); }}
                className="py-2 text-sm font-semibold transition-all duration-150"
                style={{
                  background: currency === c ? "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)" : "var(--color-muted)",
                  color: currency === c ? "#fff" : "var(--color-muted-foreground)",
                  borderLeft: i > 0 ? "1px solid var(--color-border)" : "none",
                  fontFamily: "var(--font-display)",
                }}
              >
                {c === "USD" ? "$ USD" : c === "EUR" ? "€ EUR" : "PLN"}
              </button>
            ))}
          </div>

          {/* 4. Salary slider */}
          <div className="flex items-center gap-3">
            <span className="text-xs shrink-0" style={{ color: "var(--color-muted-foreground)" }}>
              Adjust
            </span>
            <input
              type="range" min={1000} max={sliderMax} step={100} value={sliderValue}
              onChange={(e) => { const val = e.target.value; setSliderValue(Number(val)); setRawAmount(val); }}
              className="flex-1 accent-blue-500"
              style={{ height: 4 }}
            />
            <span
              className="text-sm font-semibold tabular-nums rounded-lg px-2 py-1 shrink-0"
              style={{ background: "var(--color-muted)", color: "var(--color-foreground)", minWidth: 50, textAlign: "center", fontFamily: "var(--font-display)" }}
            >
              {fmt(amount, currency)}
            </span>
          </div>
        </div>

        {/* ── RESULTS ── */}
        {results && amount > 0 && (
          <>
            {/* Two cards */}
            <div className="grid grid-cols-2 gap-3">
              <SalaryCard
                label={inputType === "gross" ? t.ifB2B : "B2B"}
                grossPLN={results.b2bGrossPLN}
                netPLN={results.b2bNetPLN}
                currency={currency}
                inputType={inputType}
                hoursPerMonth={hoursPerMonth}
                isB2B={true}
                t={t}
              />
              <SalaryCard
                label={inputType === "gross" ? t.ifUoP : "UoP"}
                grossPLN={results.uopGrossPLN}
                netPLN={results.uopNetPLN}
                currency={currency}
                inputType={inputType}
                hoursPerMonth={hoursPerMonth}
                isB2B={false}
                t={t}
              />
            </div>
          </>
        )}

        {/* Recruiter message */}
        {recruiterMessage && (
          <div
            className="rounded-2xl p-5 flex flex-col gap-3"
            style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-muted-foreground)" }}>
                {t.recruiterTitle}
              </span>
              <button
                onClick={() => { navigator.clipboard.writeText(recruiterMessage); setCopied(true); setTimeout(() => setCopied(false), 2000); trackRecruiterMessageCopy(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: copied ? "#DBEAFE" : "var(--color-muted)",
                  color: copied ? "#2563EB" : "var(--color-muted-foreground)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {copied ? (
                  <><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>{t.recruiterCopied}</>
                ) : (
                  <><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="4" y="1" width="7" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 4.5V10a1 1 0 001 1h5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>{t.recruiterCopy}</>
                )}
              </button>
            </div>
            <p className="text-sm" style={{ color: "var(--color-foreground)", lineHeight: "1.65" }}>
              {recruiterMessage}
            </p>
          </div>
        )}

        {/* Quick scenarios */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "var(--color-muted-foreground)" }}>
            {t.quickScenarios}
          </p>
          <div className="flex flex-wrap gap-2">
            {quickScenarios.map((s) => (
              <button
                key={s.label}
                onClick={() => { setRawAmount(String(s.amount)); setCurrency(s.currency); setInputType(s.type); trackQuickScenarioClick(s.label); }}
                className="px-3.5 py-2 rounded-full text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-foreground)",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  fontFamily: "var(--font-display)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#3B82F6"; (e.currentTarget as HTMLElement).style.color = "#3B82F6"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)"; (e.currentTarget as HTMLElement).style.color = "var(--color-foreground)"; }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center gap-1.5 pb-4">
          <p className="text-xs" style={{ color: "var(--color-muted-foreground)", opacity: 0.5 }}>
            {t.disclaimer}
          </p>
          <a
            href="mailto:si13n@yahoo.com"
            className="text-xs transition-opacity"
            style={{ color: "var(--color-muted-foreground)", opacity: 0.4, textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.4")}
            onClick={() => trackFeedbackClick()}
          >
            {t.feedback}
          </a>
          <p className="text-xs" style={{ color: "var(--color-muted-foreground)", opacity: 0.3 }}>
            Rates updated {RATES_UPDATED_AT}
          </p>
        </div>

        {/* Tax Settings Modals */}
        {showB2BSettings && (
          <B2BSettingsModal
            profile={profile}
            onUpdate={updateProfile}
            onReset={resetToDefaults}
            onClose={() => setShowB2BSettings(false)}
          />
        )}

        {showUoPSettings && (
          <UoPSettingsModal
            profile={profile}
            onUpdate={updateProfile}
            onReset={resetToDefaults}
            onClose={() => setShowUoPSettings(false)}
          />
        )}

      </div>
    </div>
  );
}