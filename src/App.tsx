import { useState, useMemo } from "react";

// ── i18n ───────────────────────────────────────────────────────────────────
type Lang = "en" | "pl" | "ua";

const T = {
  en: {
    title: "Salary Calculator",
    subtitle: "Poland · B2B ryczałt 12% · UoP skala podatkowa",
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
    disclaimer: "approxmate · Poland 2026",
  },
  pl: {
    title: "Kalkulator wynagrodzeń",
    subtitle: "Polska · B2B ryczałt 12% · UoP skala podatkowa",
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
    disclaimer: "approxmate · Poland 2026",
  },
  ua: {
    title: "Калькулятор зарплати",
    subtitle: "Польща · B2B ryczałt 12% · UoP skala podatkowa",
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
    feedback: "Зворотний зв'язок",
    disclaimer: "approxmate · Poland 2026",
  },
};

// ── Types ──────────────────────────────────────────────────────────────────
type Currency = "PLN" | "USD" | "EUR";
type InputType = "gross" | "net";

// ── Exchange rates ─────────────────────────────────────────────────────────
const RATES: Record<string, number> = { PLN_PLN: 1, USD_PLN: 3.85, EUR_PLN: 4.25 };
function toPLN(a: number, from: Currency) { return a * (RATES[`${from}_PLN`] ?? 1); }
function fromPLN(a: number, to: Currency) { return a / (RATES[`${to}_PLN`] ?? 1); }

// ── Tax calculations ───────────────────────────────────────────────────────
function b2bGrossToNet(grossPLN: number): number {
  const annual = grossPLN * 12;
  const zdrowotna = annual <= 60000 ? 463 : annual <= 300000 ? 772 : 1389;
  return grossPLN - 0.12 * grossPLN - zdrowotna;
}

function b2bNetToGross(netPLN: number): number {
  let lo = netPLN * 0.9, hi = netPLN * 2.5;
  for (let i = 0; i < 64; i++) {
    const mid = (lo + hi) / 2;
    b2bGrossToNet(mid) < netPLN ? (lo = mid) : (hi = mid);
  }
  return (lo + hi) / 2;
}

function uopGrossToNet(bruttoP: number): number {
  const zusEmp = 0.1371 * bruttoP;
  const zdrowotna = 0.09 * (bruttoP - zusEmp);
  const taxBase = bruttoP - zusEmp - 250;
  let tax = 0;
  if (taxBase > 10000) tax = 7500 * 0.12 + (taxBase - 10000) * 0.32;
  else if (taxBase > 2500) tax = (taxBase - 2500) * 0.12;
  return bruttoP - zusEmp - zdrowotna - tax;
}

function uopNetToGross(netPLN: number): number {
  let lo = netPLN * 0.9, hi = netPLN * 3;
  for (let i = 0; i < 64; i++) {
    const mid = (lo + hi) / 2;
    uopGrossToNet(mid) < netPLN ? (lo = mid) : (hi = mid);
  }
  return (lo + hi) / 2;
}

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

      {/* Hourly */}
      <div className="rounded-xl px-3 py-2 flex flex-col gap-2" style={{ background: "var(--color-muted)" }}>
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs mb-0.5" style={{ color: "var(--color-muted-foreground)" }}>{primaryLabel}{t.perHour}</div>
            <div className="text-sm font-semibold tabular-nums" style={{ fontFamily: "var(--font-display)", color: "var(--color-foreground)" }}>
              {fmt(fromPLN(hourlyPrimaryPLN, currency), currency, 2)}
            </div>
            <div className="text-xs tabular-nums" style={{ color: "var(--color-muted-foreground)" }}>
              {allCurrencies(hourlyPrimaryPLN, 2)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs mb-0.5" style={{ color: "var(--color-muted-foreground)" }}>{secondaryLabel}{t.perHour}</div>
            <div className="text-sm font-semibold tabular-nums" style={{ fontFamily: "var(--font-display)", color: "var(--color-foreground)" }}>
              {fmt(fromPLN(hourlySecPLN, currency), currency, 2)}
            </div>
            <div className="text-xs tabular-nums" style={{ color: "var(--color-muted-foreground)" }}>
              {allCurrencies(hourlySecPLN, 2)}
            </div>
          </div>
        </div>
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
  const [hoursPerMonth, setHoursPerMonth] = useState<number>(160);
  const [copied, setCopied] = useState(false);

  const t = T[lang];
  const amount = parseFloat(rawAmount) || 0;

  const results = useMemo(() => {
    if (amount <= 0) return null;
    const monthlyPLN = toPLN(amount, currency);

    let b2bGrossPLN: number, b2bNetPLN: number;
    let uopGrossPLN: number, uopNetPLN: number;

    if (inputType === "gross") {
      b2bGrossPLN = monthlyPLN;
      b2bNetPLN = b2bGrossToNet(monthlyPLN);
      uopGrossPLN = monthlyPLN;
      uopNetPLN = uopGrossToNet(monthlyPLN);
    } else {
      b2bNetPLN = monthlyPLN;
      b2bGrossPLN = b2bNetToGross(monthlyPLN);
      uopNetPLN = monthlyPLN;
      uopGrossPLN = uopNetToGross(monthlyPLN);
    }

    return { b2bGrossPLN, b2bNetPLN, uopGrossPLN, uopNetPLN };
  }, [amount, currency, inputType]);

  const recruiterMessage = useMemo(() => {
    if (!results || amount <= 0) return "";
    const inputVal = fmt(amount, currency);
    const msgs: Record<Lang, string> = {
      en: inputType === "net"
        ? `Hi! I'm currently considering opportunities with a take-home of around ${inputVal} net/month. I'm open to discussion depending on the project, team, and growth potential. Looking forward to learning more!`
        : `Hi! I was offered ${inputVal} gross/month and I'm currently evaluating this opportunity. I'm open to discussion depending on the project, team, and growth potential. Looking forward to learning more!`,
      pl: inputType === "net"
        ? `Cześć! Aktualnie rozpatruję oferty z wynagrodzeniem netto około ${inputVal}/miesiąc. Jestem otwarty/a na rozmowę w zależności od projektu, zespołu i możliwości rozwoju. Chętnie dowiem się więcej!`
        : `Cześć! Otrzymałem/am ofertę ${inputVal} brutto/miesiąc i aktualnie ją rozpatruję. Jestem otwarty/a na rozmowę w zależności od projektu, zespołu i możliwości rozwoju. Chętnie dowiem się więcej!`,
      ua: inputType === "net"
        ? `Привіт! Зараз я розглядаю пропозиції з чистим доходом близько ${inputVal}/місяць. Готовий/а до обговорення залежно від проєкту та команди. Буду радий/а дізнатися більше!`
        : `Привіт! Мені запропонували ${inputVal} брутто/місяць і я зараз розглядаю цю пропозицію. Готовий/а до обговорення залежно від проєкту та команди. Буду радий/а дізнатися більше!`,
    };
    return msgs[lang];
  }, [results, amount, currency, lang, inputType]);

  const quickScenarios = [
    { label: "$3k net", amount: 3000, currency: "USD" as Currency, type: "net" as InputType },
    { label: "$4k net", amount: 4000, currency: "USD" as Currency, type: "net" as InputType },
    { label: "$5k net", amount: 5000, currency: "USD" as Currency, type: "net" as InputType },
    { label: "€3.5k net", amount: 3500, currency: "EUR" as Currency, type: "net" as InputType },
    { label: "20k PLN gross", amount: 20000, currency: "PLN" as Currency, type: "gross" as InputType },
  ];

  const currSymbol = SYM[currency];
  const showPLNLabel = currency === "PLN";

  return (
    <div className="min-h-screen w-full" style={{ background: "var(--color-background)", fontFamily: "var(--font-body)" }}>
      <div className="max-w-lg mx-auto px-4 py-8 flex flex-col gap-6">

        {/* Brand + lang */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
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
                onClick={() => setLang(l)}
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
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", fontWeight: 400, color: "var(--color-foreground)", letterSpacing: "-0.02em", marginBottom: 2 }}>
            {t.title}
          </h1>
          <p style={{ fontSize: "0.75rem", color: "var(--color-muted-foreground)" }}>{t.subtitle}</p>
        </div>

        {/* ── INPUT CARD ── */}
        <div
          className="rounded-2xl p-5 flex flex-col gap-5"
          style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
        >
          {/* 1. Gross / Net — primary toggle */}
          <div className="grid grid-cols-2 rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
            {(["net", "gross"] as InputType[]).map((v, i) => (
              <button
                key={v}
                onClick={() => setInputType(v)}
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
                onChange={(e) => setRawAmount(e.target.value)}
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
                onClick={() => setCurrency(c)}
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

          {/* 4. Hours — subdued */}
          <div className="flex items-center gap-3" style={{ opacity: 0.65 }}>
            <span className="text-xs shrink-0" style={{ color: "var(--color-muted-foreground)" }}>
              {t.hoursPerMonth}
            </span>
            <input
              type="range" min={80} max={240} step={8} value={hoursPerMonth}
              onChange={(e) => setHoursPerMonth(Number(e.target.value))}
              className="flex-1 accent-blue-500"
              style={{ height: 4 }}
            />
            <span
              className="text-sm font-semibold tabular-nums rounded-lg px-2 py-1 shrink-0"
              style={{ background: "var(--color-muted)", color: "var(--color-foreground)", minWidth: 42, textAlign: "center", fontFamily: "var(--font-display)" }}
            >
              {hoursPerMonth}
            </span>
          </div>
        </div>

        {/* ── RESULTS ── */}
        {results && amount > 0 && (
          <>
            {/* Summary line */}
            <div className="px-1 flex items-baseline gap-2">
              <span style={{ fontSize: "0.8125rem", color: "var(--color-muted-foreground)" }}>
                {inputType === "net" ? t.netDesc : t.grossDesc}:
              </span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "var(--color-foreground)", letterSpacing: "-0.02em" }}>
                {fmt(amount, currency)} {inputType === "net" ? t.net.toLowerCase() : t.gross.toLowerCase()}{t.perMonth}
              </span>
              {currency !== "PLN" && (
                <span style={{ fontSize: "0.8125rem", color: "var(--color-muted-foreground)" }}>
                  ≈ {fmt(toPLN(amount, currency), "PLN")}
                </span>
              )}
            </div>

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
                onClick={() => { navigator.clipboard.writeText(recruiterMessage); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
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
                onClick={() => { setRawAmount(String(s.amount)); setCurrency(s.currency); setInputType(s.type); }}
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
            href="mailto:feedback@approxmate.app"
            className="text-xs transition-opacity"
            style={{ color: "var(--color-muted-foreground)", opacity: 0.4, textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.4")}
          >
            {t.feedback}
          </a>
        </div>

      </div>
    </div>
  );
}