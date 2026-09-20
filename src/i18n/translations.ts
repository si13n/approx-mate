import type { Lang } from "../types"

export interface Translation {
  targetQuestion: string
  desiredNet: string
  offeredGross: string
  desiredNetDesc: string
  offeredGrossDesc: string
  amount: string
  quickAmount: string
  taxProfile: string
  editTaxProfile: string
  quickScenarios: string
  toTakeHome: string
  higherCash: string
  moreProtection: string
  grossPerHour: string
  netPerHour: string
  whereMoneyGoes: string
  incomeTaxLabel: string
  contributionsLabel: string
  labourFundLabel: string
  socialInsuranceLabel: string
  healthInsuranceLabel: string
  contributionShortfall: string
  seeCalculation: string
  recruiterTitle: string
  copyMessage: string
  copied: string
  sendFeedback: string
  currency: string
  setAssumptions: string
  businessSettings: string
  businessDescription: string
  ryczaltRate: string
  howToChoose: string
  ryczaltHelp: string
  zusPlan: string
  appliedB2B: string
  start: string
  preferential: string
  fullZus: string
  employmentSettings: string
  employmentDescription: string
  kup: string
  standard: string
  commuter: string
  ppk: string
  ppkDescription: string
  taxRulesNote: string
  officialSources: string
  reset: string
  saveProfile: string
  language: string
  close: string
  grossLabel: string
  netLabel: string
  invoiceLabel: string
  takeHomeLabel: string
  loadingCalculator: string
  ryczaltTerm: string
  standardUop: string
  commuterUop: string
  jobXRayHeadline: string
  jobXRayHeadlineShort: string
  vacancyPlaceholder: string
  analyzeOffer: string
  analyzeOfferShort: string
  salaryPeriod: Record<"hour" | "day" | "month" | "year", string>
  recruiterMessage: (amount: string, type: string, period: string) => string
}

const en: Translation = {
  targetQuestion: "What do you want to know?",
  desiredNet: "Desired net",
  offeredGross: "Offered gross",
  desiredNetDesc: "I know my take-home",
  offeredGrossDesc: "I have an offer",
  amount: "Amount",
  quickAmount: "Quick amount",
  taxProfile: "Tax profile",
  editTaxProfile: "Edit tax profile",
  quickScenarios: "Quick scenarios",
  toTakeHome: "To take home",
  higherCash: "Higher cash",
  moreProtection: "More protection",
  grossPerHour: "GROSS / H",
  netPerHour: "NET / H",
  whereMoneyGoes: "Where the money goes",
  incomeTaxLabel: "Income tax",
  contributionsLabel: "Contributions",
  labourFundLabel: "Labour Fund (FP/FS)",
  socialInsuranceLabel: "Social insurance (ZUS)",
  healthInsuranceLabel: "Health insurance (NFZ)",
  contributionShortfall: "Contributions exceed income by",
  seeCalculation: "See calculation",
  recruiterTitle: "AI recruiter message",
  copyMessage: "Copy",
  copied: "Copied!",
  sendFeedback: "Send feedback",
  currency: "Currency",
  setAssumptions:
    "Set the assumptions used to calculate both B2B and UoP offers.",
  businessSettings: "Business settings",
  businessDescription: "Ryczałt and social insurance",
  ryczaltRate: "Ryczałt rate",
  howToChoose: "How to choose?",
  ryczaltHelp: "Depends on your service type and PKWiU classification.",
  zusPlan: "ZUS contribution plan",
  appliedB2B: "Applied to B2B only",
  start: "Start",
  preferential: "Preferential",
  fullZus: "Full ZUS",
  employmentSettings: "Employment settings",
  employmentDescription: "Employee costs and pension contributions",
  kup: "Tax-deductible employee costs (KUP)",
  standard: "Standard · 250 PLN",
  commuter: "Commuter · 300 PLN",
  ppk: "PPK contribution",
  ppkDescription: "Employee 2% · Employer 1.5%",
  taxRulesNote: "2026 tax rules · Changes affect every calculation",
  officialSources: "Official sources",
  reset: "Reset",
  saveProfile: "Save profile",
  language: "Language",
  close: "Close",
  grossLabel: "Gross",
  netLabel: "Net",
  invoiceLabel: "invoice",
  takeHomeLabel: "take-home",
  loadingCalculator: "Loading calculator",
  ryczaltTerm: "ryczałt",
  standardUop: "Standard UoP",
  commuterUop: "Commuter UoP",
  jobXRayHeadline: "See the whole offer at a glance.",
  jobXRayHeadlineShort: "See the whole offer.",
  vacancyPlaceholder: "Paste a link or job text",
  analyzeOffer: "Analyze offer",
  analyzeOfferShort: "Analyze",
  salaryPeriod: { hour: "hour", day: "day", month: "month", year: "year" },
  recruiterMessage: (amount, type, period) =>
    `Hi! I'm currently looking at opportunities in the range of around ${amount} ${type} per ${period}, but I'm flexible depending on the project, team, and growth opportunities. Happy to discuss the details and learn more about the role.`,
}

const pl: Translation = {
  ...en,
  targetQuestion: "Co chcesz obliczyć?",
  desiredNet: "Oczekiwane netto",
  offeredGross: "Oferowane brutto",
  desiredNetDesc: "Znam kwotę na rękę",
  offeredGrossDesc: "Mam ofertę",
  amount: "Kwota",
  quickAmount: "Szybka kwota",
  taxProfile: "Profil podatkowy",
  editTaxProfile: "Edytuj profil",
  quickScenarios: "Szybkie scenariusze",
  toTakeHome: "Aby otrzymać",
  higherCash: "Więcej gotówki",
  moreProtection: "Więcej ochrony",
  grossPerHour: "BRUTTO / H",
  netPerHour: "NETTO / H",
  whereMoneyGoes: "Podział wynagrodzenia",
  incomeTaxLabel: "Podatek",
  contributionsLabel: "Składki",
  labourFundLabel: "Fundusz Pracy (FP/FS)",
  socialInsuranceLabel: "Składki społeczne ZUS",
  healthInsuranceLabel: "Składka zdrowotna NFZ",
  contributionShortfall: "Składki przekraczają przychód o",
  seeCalculation: "Zobacz obliczenie",
  recruiterTitle: "Wiadomość AI do rekrutera",
  copyMessage: "Kopiuj",
  copied: "Skopiowano!",
  sendFeedback: "Prześlij opinię",
  currency: "Waluta",
  setAssumptions: "Ustaw założenia używane w obliczeniach B2B i UoP.",
  businessSettings: "Ustawienia działalności",
  businessDescription: "Ryczałt i ubezpieczenia społeczne",
  ryczaltRate: "Stawka ryczałtu",
  howToChoose: "Jak wybrać?",
  ryczaltHelp: "Zależy od rodzaju usług i klasyfikacji PKWiU.",
  zusPlan: "Plan składek ZUS",
  appliedB2B: "Tylko dla B2B",
  start: "Ulga na start",
  preferential: "Preferencyjny",
  fullZus: "Pełny ZUS",
  employmentSettings: "Ustawienia zatrudnienia",
  employmentDescription: "Koszty pracownika i składki emerytalne",
  kup: "Koszty uzyskania przychodu (KUP)",
  standard: "Standardowe · 250 PLN",
  commuter: "Dojazdowe · 300 PLN",
  ppk: "Składka PPK",
  ppkDescription: "Pracownik 2% · Pracodawca 1,5%",
  taxRulesNote:
    "Zasady podatkowe 2026 · Zmiany wpływają na wszystkie obliczenia",
  officialSources: "Oficjalne źródła",
  reset: "Resetuj",
  saveProfile: "Zapisz profil",
  language: "Język",
  close: "Zamknij",
  grossLabel: "Brutto",
  netLabel: "Netto",
  invoiceLabel: "faktura",
  takeHomeLabel: "na rękę",
  loadingCalculator: "Ładowanie kalkulatora",
  ryczaltTerm: "ryczałt",
  standardUop: "Standardowa UoP",
  commuterUop: "UoP z dojazdem",
  jobXRayHeadline: "Zobacz całą ofertę na pierwszy rzut oka.",
  jobXRayHeadlineShort: "Zobacz całą ofertę.",
  vacancyPlaceholder: "Wklej link lub treść oferty",
  analyzeOffer: "Analizuj ofertę",
  analyzeOfferShort: "Analizuj",
  salaryPeriod: { hour: "godz.", day: "dzień", month: "miesiąc", year: "rok" },
  recruiterMessage: (amount, type, period) =>
    `Dzień dobry! Interesują mnie oferty w przedziale około ${amount} ${type} / ${period}, ale jestem elastyczny w zależności od projektu, zespołu i możliwości rozwoju. Chętnie omówię szczegóły stanowiska.`,
}

const ua: Translation = {
  ...en,
  targetQuestion: "Що ви хочете розрахувати?",
  desiredNet: "Бажане нетто",
  offeredGross: "Запропоноване брутто",
  desiredNetDesc: "Знаю суму на руки",
  offeredGrossDesc: "Маю пропозицію",
  amount: "Сума",
  quickAmount: "Швидка сума",
  taxProfile: "Податковий профіль",
  editTaxProfile: "Редагувати профіль",
  quickScenarios: "Швидкі сценарії",
  toTakeHome: "Щоб отримувати",
  higherCash: "Більше коштів",
  moreProtection: "Більше захисту",
  grossPerHour: "БРУТТО / ГОД",
  netPerHour: "НЕТТО / ГОД",
  whereMoneyGoes: "Розподіл коштів",
  incomeTaxLabel: "Податок",
  contributionsLabel: "Внески",
  labourFundLabel: "Фонд праці (FP/FS)",
  socialInsuranceLabel: "Соціальні внески ZUS",
  healthInsuranceLabel: "Медичний внесок NFZ",
  contributionShortfall: "Внески перевищують дохід на",
  seeCalculation: "Переглянути розрахунок",
  recruiterTitle: "AI-повідомлення рекрутеру",
  copyMessage: "Копіювати",
  copied: "Скопійовано!",
  sendFeedback: "Надіслати відгук",
  currency: "Валюта",
  setAssumptions: "Налаштуйте припущення для розрахунків B2B та UoP.",
  businessSettings: "Налаштування бізнесу",
  businessDescription: "Ричалт і соціальне страхування",
  ryczaltRate: "Ставка ричалту",
  howToChoose: "Як обрати?",
  ryczaltHelp: "Залежить від виду послуг і класифікації PKWiU.",
  zusPlan: "План внесків ZUS",
  appliedB2B: "Тільки для B2B",
  start: "Пільга на старт",
  preferential: "Пільговий",
  fullZus: "Повний ZUS",
  employmentSettings: "Налаштування зайнятості",
  employmentDescription: "Витрати працівника й пенсійні внески",
  kup: "Витрати працівника (KUP)",
  standard: "Стандартні · 250 PLN",
  commuter: "Для поїздок · 300 PLN",
  ppk: "Внесок PPK",
  ppkDescription: "Працівник 2% · Роботодавець 1,5%",
  taxRulesNote: "Податкові правила 2026 · Зміни впливають на всі розрахунки",
  officialSources: "Офіційні джерела",
  reset: "Скинути",
  saveProfile: "Зберегти профіль",
  language: "Мова",
  close: "Закрити",
  grossLabel: "Брутто",
  netLabel: "Нетто",
  invoiceLabel: "інвойс",
  takeHomeLabel: "на руки",
  loadingCalculator: "Завантаження калькулятора",
  ryczaltTerm: "ричалт",
  standardUop: "Стандартна UoP",
  commuterUop: "UoP з витратами на проїзд",
  jobXRayHeadline: "Побачте всю пропозицію одним поглядом.",
  jobXRayHeadlineShort: "Побачте всю пропозицію.",
  vacancyPlaceholder: "Вставте посилання або текст вакансії",
  analyzeOffer: "Аналізувати пропозицію",
  analyzeOfferShort: "Аналіз",
  salaryPeriod: { hour: "год.", day: "день", month: "місяць", year: "рік" },
  recruiterMessage: (amount, type, period) =>
    `Вітаю! Я розглядаю можливості в діапазоні близько ${amount} ${type} / ${period}, але готовий обговорювати умови залежно від проєкту, команди та можливостей розвитку. Буду радий дізнатися більше про роль.`,
}

export const translations: Record<Lang, Translation> = { en, pl, ua }
