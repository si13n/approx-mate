import { useState, useMemo, useEffect } from "react";
import {
  b2bGrossToNet,
  b2bNetToGross,
  uopGrossToNet,
  uopNetToGross,
  createCalculationEngine,
} from "./lib/calculations";

// ── i18n ───────────────────────────────────────────────────────────────────
type Lang = "en" | "pl" | "ua";

const T = {
  en: {
    title: "Salary Calculator",
    subtitle: "Poland · B2B ryczałt 12% · UoP skala podatkowa",
    modeOffer: "They offer me",
    modeWant: "I want to earn",
    gross: "Gross",
    net: "Net",
    monthly: "Monthly",
    hourly: "Per hour",
    hours: "hrs/mo",
    b2b: "B2B",
    uop: "UoP",
    contract: "Contract",
    period: "Period",
    yourInput: "Enter amount",
    takeHome: "Take-home (net)",
    b2bGross: "B2B gross (invoice)",
    uopGross: "UoP gross (brutto)",
    perHour: "Hourly rate",
    quickScenarios: "Quick scenarios",
    effective: "effective rate",
    disclaimer: "approxmate · Poland 2026",
    recruiterTitle: "Message for recruiter",
    recruiterCopy: "Copy",
    recruiterCopied: "Copied!",
    recruiterRegen: "Regenerate",
    feedback: "Send feedback",
    ratesUpdated: "Rates updated",
  },
  pl: {
    title: "Kalkulator wynagrodzeń",
    subtitle: "Polska · B2B ryczałt 12% · UoP skala podatkowa",
    modeOffer: "Oferują mi",
    modeWant: "Chcę zarabiać",
    gross: "Brutto",
    net: "Netto",
    monthly: "Miesięcznie",
    hourly: "Za godzinę",
    hours: "godz/mies",
    b2b: "B2B",
    uop: "UoP",
    contract: "Rodzaj umowy",
    period: "Okres",
    yourInput: "Wpisz kwotę",
    takeHome: "Na rękę (netto)",
    b2bGross: "Brutto B2B (faktura)",
    uopGross: "Brutto UoP",
    perHour: "Stawka godzinowa",
    quickScenarios: "Szybkie scenariusze",
    effective: "efektywna stawka",
    disclaimer: "approxmate · Poland 2026",
    recruiterTitle: "Wiadomość dla rekrutera",
    recruiterCopy: "Kopiuj",
    recruiterCopied: "Skopiowano!",
    recruiterRegen: "Wygeneruj ponownie",
    feedback: "Prześlij opinię",
    ratesUpdated: "Kursy zaktualizowane",
  },
  ua: {
    title: "Калькулятор зарплати",
    subtitle: "Польща · B2B ryczałt 12% · UoP skala podatkowa",
    modeOffer: "Мені пропонують",
    modeWant: "Я хочу отримувати",
    gross: "Брутто",
    net: "Нетто",
    monthly: "На місяць",
    hourly: "На годину",
    hours: "год/міс",
    b2b: "B2B",
    uop: "UoP",
    contract: "Тип договору",
    period: "Період",
    yourInput: "Введіть суму",
    takeHome: "На руки (нетто)",
    b2bGross: "Брутто B2B (рахунок)",
    uopGross: "Брутто UoP",
    perHour: "Погодинна ставка",
    quickScenarios: "Швидкі сценарії",
    effective: "ефективна ставка",
    disclaimer: "approxmate · Poland 2026",
    recruiterTitle: "Повідомлення для рекрутера",
    recruiterCopy: "Копіювати",
    recruiterCopied: "Скопійовано!",
    recruiterRegen: "Оновити",
    feedback: "Зворотній зв'язок",
    ratesUpdated: "Курси оновлені",
  },
};

// ── Types ──────────────────────────────────────────────────────────────────
type Currency = "PLN" | "USD" | "EUR";
type ContractType = "B2B" | "UoP";
type Mode = "offer" | "want";
type Period = "monthly" | "hourly";

// ── Formatters ─────────────────────────────────────────────────────────────
const CURRENCY_SYMBOLS: Record<Currency, string> = { PLN: "", USD: "$", EUR: "€" };
const CURRENCY_SUFFIXES: Record<Currency, string> = { PLN: " PLN", USD: "", EUR: "" };

function fmt(amount: number, currency: Currency, decimals = 0): string {
  const rounded = Math.round(amount * Math.pow(10, decimals)) / Math.pow(10, decimals);
  const parts = rounded.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${CURRENCY_SYMBOLS[currency]}${parts}${CURRENCY_SUFFIXES[currency]}`;
}

function fmtPLN(amount: number): string {
  return `${Math.round(amount).toLocaleString("en-US")} PLN`;
}

// ── Sub-components ─────────────────────────────────────────────────────────
function Toggle({
  options,
  value,
  onChange,
}: {
  options: [string, string];
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="relative flex rounded-full p-0.5" style={{ background: "var(--color-muted)", border: "1px solid var(--color-border)" }}>
      <button
        onClick={() => onChange(false)}
        className="relative z-10 px-5 py-2 text-sm font-medium rounded-full transition-all duration-200"
        style={{
          background: !value ? "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)" : "transparent",
          color: !value ? "#fff" : "var(--color-muted-foreground)",
          fontFamily: "var(--font-body)",
        }}
      >
        {options[0]}
      </button>
      <button
        onClick={() => onChange(true)}
        className="relative z-10 px-5 py-2 text-sm font-medium rounded-full transition-all duration-200"
        style={{
          background: value ? "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)" : "transparent",
          color: value ? "#fff" : "var(--color-muted-foreground)",
          fontFamily: "var(--font-body)",
        }}
      >
        {options[1]}
      </button>
    </div>
  );
}

function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
      {options.map((opt, i) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className="flex-1 px-4 py-2 text-sm font-medium transition-all duration-150"
          style={{
            background: value === opt.value ? "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)" : "var(--color-card)",
            color: value === opt.value ? "#fff" : "var(--color-muted-foreground)",
            fontFamily: "var(--font-body)",
            borderLeft: i > 0 ? "1px solid var(--color-border)" : "none",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ResultRow({
  label,
  plnValue,
  displayCurrency,
  highlight,
  subtext,
  noBorder,
  toPLN,
  fromPLN,
}: {
  label: string;
  plnValue: number;
  displayCurrency: Currency;
  highlight?: boolean;
  subtext?: string;
  noBorder?: boolean;
  toPLN: (amount: number, from: Currency) => number;
  fromPLN: (amount: number, to: Currency) => number;
}) {
  const displayValue = fromPLN(plnValue, displayCurrency);
  const otherCurrencies: Currency[] = ["PLN", "USD", "EUR"].filter(
    (c) => c !== displayCurrency
  ) as Currency[];

  return (
    <div
      className="flex items-start justify-between py-3 gap-4"
      style={{ borderBottom: noBorder ? "none" : "1px solid var(--color-border)" }}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <span
          className="text-sm font-medium"
          style={{ color: highlight ? "rgb(59, 130, 246)" : "var(--color-muted-foreground)" }}
        >
          {label}
        </span>
        {subtext && (
          <span className="text-xs" style={{ color: "var(--color-muted-foreground)", opacity: 0.7 }}>
            {subtext}
          </span>
        )}
      </div>
      <div className="flex flex-col items-end gap-0.5 shrink-0">
        <span
          className="font-semibold tabular-nums"
          style={{
            fontSize: highlight ? "1.25rem" : "1rem",
            fontFamily: "var(--font-display)",
            color: highlight ? "var(--color-foreground)" : "var(--color-foreground)",
          }}
        >
          {fmt(displayValue, displayCurrency)}
        </span>
        <div className="flex gap-2">
          {otherCurrencies.map((c) => (
            <span
              key={c}
              className="text-xs tabular-nums"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              {fmt(fromPLN(plnValue, c), c)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState<Lang>("en");
  const [mode, setMode] = useState<Mode>("offer");
  const [inputType, setInputType] = useState<"gross" | "net">("gross");
  const [copied, setCopied] = useState(false);
  const [rawAmount, setRawAmount] = useState<string>("5000");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [contractType, setContractType] = useState<ContractType>("B2B");
  const [period, setPeriod] = useState<Period>("monthly");
  const [hoursPerMonth, setHoursPerMonth] = useState<number>(160);
  const [ratesData, setRatesData] = useState<{ rates: Record<string, number>; timestamp: string } | null>(null);

  const t = T[lang];

  useEffect(() => {
    const loadRates = async () => {
      try {
        const response = await fetch("/exchange-rates.json");
        const data = await response.json();
        setRatesData({
          rates: data.rates,
          timestamp: data.timestamp,
        });
      } catch (error) {
        console.error("Failed to load exchange rates:", error);
        setRatesData({
          rates: {
            PLN_PLN: 1,
            USD_PLN: 3.85,
            EUR_PLN: 4.25,
          },
          timestamp: new Date().toISOString(),
        });
      }
    };

    loadRates();
  }, []);

  const { toPLN, fromPLN } = ratesData ? createCalculationEngine(ratesData.rates) : { toPLN: () => 0, fromPLN: () => 0 };
  const amount = parseFloat(rawAmount) || 0;

  const results = useMemo(() => {
    if (amount <= 0) return null;

    const monthlyInput = period === "hourly" ? amount * hoursPerMonth : amount;
    const monthlyPLN = toPLN(monthlyInput, currency);

    let netPLN: number;
    let b2bGrossPLN: number;
    let uopGrossPLN: number;

    if (inputType === "gross") {
      if (contractType === "B2B") {
        b2bGrossPLN = monthlyPLN;
        netPLN = b2bGrossToNet(monthlyPLN);
        uopGrossPLN = uopNetToGross(netPLN);
      } else {
        uopGrossPLN = monthlyPLN;
        netPLN = uopGrossToNet(monthlyPLN);
        b2bGrossPLN = b2bNetToGross(netPLN);
      }
    } else {
      netPLN = monthlyPLN;
      b2bGrossPLN = b2bNetToGross(netPLN);
      uopGrossPLN = uopNetToGross(netPLN);
    }

    const b2bEffective = ((b2bGrossPLN - netPLN) / b2bGrossPLN) * 100;
    const uopEffective = ((uopGrossPLN - netPLN) / uopGrossPLN) * 100;
    const hourlyNetPLN = netPLN / hoursPerMonth;
    const hourlyB2BPLN = b2bGrossPLN / hoursPerMonth;
    const hourlyUoPPLN = uopGrossPLN / hoursPerMonth;

    return {
      netPLN,
      b2bGrossPLN,
      uopGrossPLN,
      b2bEffective,
      uopEffective,
      hourlyNetPLN,
      hourlyB2BPLN,
      hourlyUoPPLN,
    };
  }, [amount, currency, contractType, period, hoursPerMonth, mode, inputType, toPLN]);

  const recruiterMessage = useMemo(() => {
    if (!results || amount <= 0) return "";
    const netVal = fmt(fromPLN(results.netPLN, currency), currency);
    const b2bVal = fmt(fromPLN(results.b2bGrossPLN, currency), currency);
    const uopVal = fmt(fromPLN(results.uopGrossPLN, currency), currency);
    const alternativeContract = contractType === "B2B" ? "UoP" : "B2B";
    const alternativeGrossVal = alternativeContract === "B2B" ? b2bVal : uopVal;

    const msgs: Record<string, Record<Lang, string>> = {
      net: {
        en: `Hi! My compensation expectation is around ${netVal} net per month.

This corresponds to approximately ${b2bVal} on B2B or ${uopVal} gross on UoP.

I'm open to discussing the final compensation depending on the role and overall package.`,
        pl: `Cześć! Moje oczekiwania finansowe to około ${netVal} netto miesięcznie.

Odpowiada to mniej więcej ${b2bVal} na B2B lub ${uopVal} brutto na UoP.

Jestem otwarty na rozmowę o ostatecznych warunkach w zależności od stanowiska i całego pakietu.`,
        ua: `Привіт! Мої фінансові очікування — близько ${netVal} нетто на місяць.

Це відповідає приблизно ${b2bVal} на B2B або ${uopVal} брутто на UoP.

Я відкритий до обговорення фінальних умов залежно від ролі та загального компенсаційного пакета.`,
      },
      gross: {
        en: `Hi! My compensation expectation is around ${rawAmount} gross per month on ${contractType}.

This would result in approximately ${netVal} net per month.

For comparison, the equivalent compensation is approximately ${alternativeGrossVal} on ${alternativeContract}.

I'm open to discussing the final compensation depending on the role and overall package.`,
        pl: `Cześć! Moje oczekiwania finansowe to około ${rawAmount} brutto miesięcznie na ${contractType}.

Oznacza to około ${netVal} netto miesięcznie.

Dla porównania, zbliżony poziom wynagrodzenia to około ${alternativeGrossVal} na ${alternativeContract}.

Jestem otwarty na rozmowę o ostatecznych warunkach w zależności od stanowiska i całego pakietu.`,
        ua: `Привіт! Мої фінансові очікування — близько ${rawAmount} брутто на місяць за контрактом ${contractType}.

Це становить приблизно ${netVal} нетто на місяць.

Для порівняння, еквівалентна компенсація становить приблизно ${alternativeGrossVal} за ${alternativeContract}.

Я відкритий до обговорення фінальних умов залежно від ролі та загального компенсаційного пакета.`,
      },
    };
    return msgs[inputType][lang];
  }, [results, amount, rawAmount, currency, lang, fromPLN, contractType, inputType]);

  const quickScenarios: { label: string; amount: number; currency: Currency; mode: Mode; contract: ContractType }[] = [
    { label: "$3k net", amount: 3000, currency: "USD", mode: "want", contract: "B2B" },
    { label: "$4k net", amount: 4000, currency: "USD", mode: "want", contract: "B2B" },
    { label: "$5k net", amount: 5000, currency: "USD", mode: "want", contract: "B2B" },
    { label: "€3.5k net", amount: 3500, currency: "EUR", mode: "want", contract: "B2B" },
    { label: "20k PLN B2B", amount: 20000, currency: "PLN", mode: "offer", contract: "B2B" },
    { label: "25k PLN UoP", amount: 25000, currency: "PLN", mode: "offer", contract: "UoP" },
  ];

  return !ratesData ? (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>
  ) : (
    <div className="min-h-screen w-full" style={{ background: "var(--color-background)", fontFamily: "var(--font-body)" }}>
      <div className="max-w-lg mx-auto px-4 py-8 flex flex-col gap-5">

        {/* Brand */}
        <div className="flex items-center gap-3 mb-1">
          <div
            className="flex items-center justify-center rounded-xl shrink-0"
            style={{
              width: 42, height: 42,
              background: "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)",
              boxShadow: "0 2px 10px rgba(59,130,246,0.35)",
            }}
          >
            <span style={{ fontSize: "1.375rem", fontWeight: 700, color: "#fff", lineHeight: 1, fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>≈</span>
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: "var(--color-foreground)", letterSpacing: "-0.03em" }}>
            approxmate
          </span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 400, color: "var(--color-foreground)", letterSpacing: "-0.02em" }}>
              {t.title}
            </h1>
            <p style={{ fontSize: "0.8125rem", color: "var(--color-muted-foreground)", marginTop: "2px" }}>
              {t.subtitle}
            </p>
          </div>
          <div className="flex gap-1 rounded-lg overflow-hidden mt-1" style={{ border: "1px solid var(--color-border)", background: "var(--color-card)" }}>
            {(["en", "pl", "ua"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className="px-2.5 py-1.5 text-xs font-semibold transition-all duration-150 uppercase"
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

        {/* Mode toggle */}
        <div className="flex justify-center">
          <Toggle
            options={[t.modeOffer, t.modeWant]}
            value={mode === "want"}
            onChange={(v) => setMode(v ? "want" : "offer")}
          />
        </div>

        {/* Input card */}
        <div
          className="rounded-2xl p-5 flex flex-col gap-4"
          style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
        >
          {/* Amount row */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-muted-foreground)" }}>
                Amount
              </label>
              <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
                {(["gross", "net"] as const).map((v, i) => (
                  <button
                    key={v}
                    onClick={() => setInputType(v)}
                    className="px-3 py-1 text-xs font-semibold uppercase transition-all duration-150"
                    style={{
                      background: inputType === v ? "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)" : "var(--color-card)",
                      color: inputType === v ? "#fff" : "var(--color-muted-foreground)",
                      borderLeft: i > 0 ? "1px solid var(--color-border)" : "none",
                    }}
                  >
                    {v === "gross" ? t.gross : t.net}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold select-none" style={{ color: "var(--color-muted-foreground)" }}>
                {currency === "USD" ? "$" : currency === "EUR" ? "€" : ""}
              </span>
              <input
                type="number"
                value={rawAmount}
                onChange={(e) => setRawAmount(e.target.value)}
                placeholder={t.yourInput}
                className="w-full rounded-xl py-3 text-lg font-semibold outline-none transition-all"
                style={{
                  paddingLeft: currency === "PLN" ? "1rem" : "2rem",
                  paddingRight: currency === "PLN" ? "3.5rem" : "1rem",
                  background: "var(--color-muted)",
                  border: "1.5px solid transparent",
                  color: "var(--color-foreground)",
                  fontFamily: "var(--font-display)",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#3B82F6"; e.currentTarget.style.background = "#fff"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.background = "var(--color-muted)"; }}
              />
              {currency === "PLN" && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium select-none" style={{ color: "var(--color-muted-foreground)" }}>PLN</span>
              )}
            </div>
          </div>

          {/* Currency */}
          <div>
            <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block" style={{ color: "var(--color-muted-foreground)" }}>
              Currency
            </label>
            <SegmentedControl
              options={[
                { label: "$ USD", value: "USD" },
                { label: "€ EUR", value: "EUR" },
                { label: "PLN", value: "PLN" },
              ]}
              value={currency}
              onChange={(v) => setCurrency(v as Currency)}
            />
          </div>

          {/* Contract + Period */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block" style={{ color: "var(--color-muted-foreground)" }}>
                {t.contract}
              </label>
              <SegmentedControl
                options={[{ label: t.b2b, value: "B2B" }, { label: t.uop, value: "UoP" }]}
                value={contractType}
                onChange={(v) => setContractType(v as ContractType)}
              />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block" style={{ color: "var(--color-muted-foreground)" }}>
                {t.period}
              </label>
              <SegmentedControl
                options={[{ label: t.monthly, value: "monthly" }, { label: t.hourly, value: "hourly" }]}
                value={period}
                onChange={(v) => setPeriod(v as Period)}
              />
            </div>
          </div>

          {/* Hours slider (visible when hourly) */}
          {period === "hourly" && (
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={80}
                max={240}
                step={8}
                value={hoursPerMonth}
                onChange={(e) => setHoursPerMonth(Number(e.target.value))}
                className="flex-1 accent-teal-700"
              />
              <div className="flex items-center gap-1.5 rounded-lg px-3 py-1.5" style={{ background: "var(--color-muted)", minWidth: "88px" }}>
                <input
                  type="number"
                  value={hoursPerMonth}
                  onChange={(e) => setHoursPerMonth(Math.max(1, Math.min(300, Number(e.target.value))))}
                  className="w-10 text-sm font-semibold text-right bg-transparent outline-none"
                  style={{ color: "var(--color-foreground)" }}
                />
                <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{t.hours}</span>
              </div>
            </div>
          )}
        </div>

        {/* Results card */}
        {results && amount > 0 && (
          <div
            className="rounded-2xl p-5 flex flex-col"
            style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
          >
            {/* Net take-home — highlighted */}
            <ResultRow
              label={t.takeHome}
              plnValue={results.netPLN}
              displayCurrency={currency}
              highlight
              noBorder
              toPLN={toPLN}
              fromPLN={fromPLN}
            />

            {/* Divider with label */}
            <div className="flex items-center gap-3 my-1 py-1">
              <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
              <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-muted-foreground)" }}>
                {mode === "offer" ? "equivalents" : "gross needed"}
              </span>
              <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
            </div>

            {/* B2B row */}
            <ResultRow
              label={t.b2bGross}
              plnValue={results.b2bGrossPLN}
              displayCurrency={currency}
              subtext={`${Math.round(results.b2bEffective)}% ${t.effective}`}
              toPLN={toPLN}
              fromPLN={fromPLN}
            />

            {/* UoP row */}
            <ResultRow
              label={t.uopGross}
              plnValue={results.uopGrossPLN}
              displayCurrency={currency}
              subtext={`${Math.round(results.uopEffective)}% ${t.effective}`}
              toPLN={toPLN}
              fromPLN={fromPLN}
            />

            {/* Hourly rates */}
            <div className="mt-3 rounded-xl p-3 flex gap-4 items-center justify-center" style={{ background: "var(--color-muted)" }}>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-medium" style={{ color: "var(--color-muted-foreground)" }}>{t.perHour} · {t.net}</span>
                <span className="text-sm font-semibold tabular-nums" style={{ fontFamily: "var(--font-display)", color: "var(--color-foreground)" }}>
                  {fmtPLN(results.hourlyNetPLN)} / {fmt(fromPLN(results.hourlyNetPLN, currency === "PLN" ? "USD" : currency), currency === "PLN" ? "USD" : currency, 2)}
                </span>
              </div>
              <div className="w-px" style={{ background: "var(--color-border)" }} />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-medium" style={{ color: "var(--color-muted-foreground)" }}>{t.perHour} · B2B {t.gross}</span>
                <span className="text-sm font-semibold tabular-nums" style={{ fontFamily: "var(--font-display)", color: "var(--color-foreground)" }}>
                  {fmtPLN(results.hourlyB2BPLN)} / {fmt(fromPLN(results.hourlyB2BPLN, currency === "PLN" ? "USD" : currency), currency === "PLN" ? "USD" : currency, 2)}
                </span>
              </div>
            </div>
          </div>
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
                onClick={() => {
                  navigator.clipboard.writeText(recruiterMessage);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
                style={{
                  background: copied ? "var(--color-primary-light)" : "var(--color-muted)",
                  color: copied ? "#2563EB" : "var(--color-muted-foreground)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {copied ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {t.recruiterCopied}
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="4" y="1" width="7" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 4.5V10a1 1 0 001 1h5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                    {t.recruiterCopy}
                  </>
                )}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "var(--color-muted)", color: "var(--color-muted-foreground)" }}>
                {inputType === "gross" ? t.gross : t.net}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "var(--color-muted)", color: "var(--color-muted-foreground)" }}>
                {contractType}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "var(--color-muted)", color: "var(--color-muted-foreground)" }}>
                {currency}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "var(--color-muted)", color: "var(--color-muted-foreground)" }}>
                {period === "hourly" ? `${hoursPerMonth}h/mo` : t.monthly}
              </span>
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--color-foreground)", lineHeight: "1.65", fontFamily: "var(--font-body)" }}
            >
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
                onClick={() => {
                  setRawAmount(String(s.amount));
                  setCurrency(s.currency);
                  setMode(s.mode);
                  setContractType(s.contract);
                  setPeriod("monthly");
                }}
                className="px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-foreground)",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  fontFamily: "var(--font-display)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#3B82F6";
                  (e.currentTarget as HTMLButtonElement).style.color = "#3B82F6";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-border)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--color-foreground)";
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rates info + disclaimer + feedback */}
        <div className="flex flex-col items-center gap-1.5 pb-6">
          {ratesData && (
            <p className="text-center text-xs" style={{ color: "var(--color-muted-foreground)", opacity: 0.5 }}>
              {t.ratesUpdated} {new Date(ratesData.timestamp).toLocaleDateString(lang === "pl" ? "pl-PL" : lang === "ua" ? "uk-UA" : "en-US")}
            </p>
          )}
          <p className="text-center text-xs" style={{ color: "var(--color-muted-foreground)", opacity: 0.7 }}>
            {t.disclaimer}
          </p>
          <a
            href="mailto:si13n@yahoo.com"
            className="text-xs transition-opacity duration-150 hover:opacity-100"
            style={{ color: "var(--color-muted-foreground)", opacity: 0.5, textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
          >
            {t.feedback}
          </a>
        </div>
      </div>
    </div>
  );
}
