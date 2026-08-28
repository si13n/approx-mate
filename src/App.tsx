import { useState, useMemo, useEffect } from "react";
import { trackPageView, trackCalculatorUsed, trackModeChanged, trackCurrencyChanged, trackLanguageChanged, trackRecruiterMessageCopy, trackQuickScenarioClick, trackFeedbackClick, trackTaxProfileOpen } from "./lib/analytics";
import { useTaxProfile } from "./lib/useTaxProfile";
import { RATES, fmt, toPLN, fromPLN, RATES_UPDATED_AT } from "./lib/formatting";
import { TaxProfileDisplay } from "./components/TaxProfileDisplay";
import { B2BSettingsModal } from "./components/B2BSettingsModal";
import { UoPSettingsModal } from "./components/UoPSettingsModal";
import { ComparisonPage } from "./components/ComparisonPage";
import { CalculatorWorkspace } from "./components/CalculatorWorkspace";
import { Header } from "./components/Header";
import { Currency, InputType, Lang } from "./types";

// ── i18n ───────────────────────────────────────────────────────────────────

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

// ── Types (imported from types.ts) ────────────────────────────────────────

// ── Exchange rates (imported from lib/formatting) ──────────────────────────

// ── Tax calculations (delegated to configurable engine) ────────────────────
import { calculateB2BFromGross, calculateB2BFromNet, calculateUoPFromGross, calculateUoPFromNet } from "./lib/taxCalculations";

// ── Formatters (imported from lib/formatting) ──────────────────────────────


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
  const [showComparison, setShowComparison] = useState(false);

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

  if (showComparison) {
    return <ComparisonPage onBack={() => setShowComparison(false)} />;
  }

  return (
    <div className="min-h-screen w-full" style={{ background: "var(--color-background)", fontFamily: "var(--font-body)" }}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-6">

        {/* Header */}
        {isLoaded && (
          <Header
            lang={lang}
            onLanguageChange={(l) => { setLang(l); trackLanguageChanged(l); }}
            b2bLabel={`${profile.b2b.ryczaltRate}% ryczałt`}
            uopLabel="Standard UoP"
            onEditTaxProfile={() => { setShowB2BSettings(true); trackTaxProfileOpen(); }}
            onCompare={() => setShowComparison(true)}
          />
        )}

        {/* ── WORKSPACE (2-column on desktop, 1-column on mobile) ── */}
        <CalculatorWorkspace
          amount={amount}
          rawAmount={rawAmount}
          currency={currency}
          inputType={inputType}
          sliderValue={sliderValue}
          onAmountChange={(val) => setRawAmount(val)}
          onSliderChange={(val) => setSliderValue(val)}
          onCurrencyChange={(c) => { setCurrency(c); trackCurrencyChanged(c); }}
          onInputTypeChange={(type) => { setInputType(type); trackModeChanged(type); }}
          onOpenB2BSettings={() => { setShowB2BSettings(true); trackTaxProfileOpen(); }}
          onOpenUoPSettings={() => { setShowUoPSettings(true); trackTaxProfileOpen(); }}
          onQuickScenarioClick={(label) => trackQuickScenarioClick(label)}
          quickScenarios={quickScenarios}
          results={results}
          hoursPerMonth={hoursPerMonth}
          onCompareClick={() => setShowComparison(true)}
          recruiterMessage={recruiterMessage}
          onCopyMessage={() => { navigator.clipboard.writeText(recruiterMessage); setCopied(true); setTimeout(() => setCopied(false), 2000); trackRecruiterMessageCopy(); }}
          copied={copied}
          t={t}
        />

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