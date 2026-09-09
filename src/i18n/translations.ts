import type { Lang } from "../types"

export interface Translation {
  heroTitle: string
  heroDescription: string
  heroDescriptionMobile: string
  yourTarget: string
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
  yourDecision: string
  toTakeHome: string
  perMonth: string
  b2b: string
  uop: string
  higherCash: string
  moreProtection: string
  invoiceEquivalent: string
  grossEquivalent: string
  takeHome: string
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
  compareOffers: string
  compareDescription: string
  recruiterTitle: string
  copyMessage: string
  copied: string
  assumptionsTitle: string
  rulesExample: string
  ratesDaily: string
  transparentAssumptions: string
  estimateAdvice: string
  sendFeedback: string
  backToCalculator: string
  compareSubtitle: string
  yourOffers: string
  editOffers: string
  upToThree: string
  addOffer: string
  bestTakeHome: string
  winsBy: string
  aheadBy: string
  moreEachYear: string
  monthly: string
  versus: string
  share: string
  shared: string
  detailedComparison: string
  comparisonBasis: string
  swipeOffers: string
  contractType: string
  grossMonthly: string
  netMonthly: string
  netYear: string
  hourlyNet: string
  hourlyGross: string
  currency: string
  notes: string
  noNotes: string
  standardEmployment: string
  best: string
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
  removeOffer: string
  close: string
  grossLabel: string
  netLabel: string
  invoiceLabel: string
  takeHomeLabel: string
  monthShort: string
  metric: string
  polandRules: string
  fallbackRates: string
  loadingCalculator: string
  of: string
  offerLabel: string
  ryczaltTerm: string
  standardUop: string
  commuterUop: string
  jobXRay: string
  analyzeAnyVacancy: string
  vacancyPlaceholder: string
  analyzeOffer: string
  analyzingOffer: string
  jobAnalysisLimit: string
  jobAnalysisInvalid: string
  jobAnalysisTooLarge: string
  jobAnalysisPasteFallback: string
  workspaceTabs: string
  calculatorTab: string
  closeOffer: string
  offerAnalysis: string
  untitledOffer: string
  parsedFromJobPost: string
  parsedFromPastedText: string
  viewSource: string
  offerSource: string
  employment: string
  salary: string
  workMode: string
  requiredSkills: string
  responsibilities: string
  niceToHave: string
  offerDetails: string
  location: string
  seniority: string
  experience: string
  english: string
  company: string
  benefits: string
  notMentioned: string
  workModes: Record<"remote" | "hybrid" | "onsite", string>
  salaryPeriod: Record<"hour" | "day" | "month" | "year", string>
  officeDays: (count: number) => string
  recruiterMessage: (amount: string, type: string) => string
}

const en: Translation = {
  heroTitle: "Know what an offer is really worth.",
  heroDescription:
    "Poland 2026 · Compare B2B and UoP, work backwards from your target take-home, and negotiate with confidence.",
  heroDescriptionMobile: "B2B ↔ UoP decisions for Poland 2026.",
  yourTarget: "YOUR TARGET",
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
  yourDecision: "Your decision",
  toTakeHome: "To take home",
  perMonth: "/ month",
  b2b: "B2B",
  uop: "UoP",
  higherCash: "Higher cash",
  moreProtection: "More protection",
  invoiceEquivalent: "Invoice equivalent",
  grossEquivalent: "Gross equivalent",
  takeHome: "TAKE-HOME / MO",
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
  compareOffers: "Compare offers",
  compareDescription:
    "Add 2–3 offers and rank them by cash, total value, and effective hourly rate.",
  recruiterTitle: "Message for recruiter",
  copyMessage: "Copy message",
  copied: "Copied!",
  assumptionsTitle: "Transparent assumptions",
  rulesExample: "2026 rules · annual average",
  ratesDaily: "NBP rates · refreshed daily",
  transparentAssumptions: "Transparent assumptions",
  estimateAdvice: "Estimate, not tax advice",
  sendFeedback: "Send feedback",
  backToCalculator: "Back to calculator",
  compareSubtitle:
    "See which offer gives you more — after tax, per year, and per hour.",
  yourOffers: "YOUR OFFERS",
  editOffers: "Edit the offers you want to compare",
  upToThree: "Up to 3 offers",
  addOffer: "Add another offer",
  bestTakeHome: "BEST TAKE-HOME",
  winsBy: "wins by",
  aheadBy: "is ahead by",
  moreEachYear: "more in take-home pay each year.",
  monthly: "monthly",
  versus: "vs",
  share: "Share",
  shared: "Copied",
  detailedComparison: "Detailed comparison",
  comparisonBasis: "Same tax profile · daily NBP rates · 160 h / month",
  swipeOffers: "3 offers: swipe columns horizontally",
  contractType: "Contract type",
  grossMonthly: "Gross / invoice per month",
  netMonthly: "Net per month",
  netYear: "Net per year",
  hourlyNet: "Hourly net · 160 h / month",
  hourlyGross: "Hourly gross · 160 h / month",
  currency: "Currency",
  notes: "Notes",
  noNotes: "No notes",
  standardEmployment: "Standard employment contract",
  best: "BEST",
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
  removeOffer: "Remove",
  close: "Close",
  grossLabel: "Gross",
  netLabel: "Net",
  invoiceLabel: "invoice",
  takeHomeLabel: "take-home",
  monthShort: "mo",
  metric: "METRIC",
  polandRules: "Poland · 2026 rules",
  fallbackRates: "fallback rates",
  loadingCalculator: "Loading calculator",
  of: "OF",
  offerLabel: "Offer",
  ryczaltTerm: "ryczałt",
  standardUop: "Standard UoP",
  commuterUop: "Commuter UoP",
  jobXRay: "JOB X-RAY",
  analyzeAnyVacancy: "Analyze any vacancy",
  vacancyPlaceholder: "Paste a link or job text",
  analyzeOffer: "Analyze offer",
  analyzingOffer: "Analyzing…",
  jobAnalysisLimit: "Maximum of 3 offers reached",
  jobAnalysisInvalid: "Paste a vacancy link or a longer job description.",
  jobAnalysisTooLarge: "This vacancy is too large to analyze.",
  jobAnalysisPasteFallback:
    "We couldn’t read this page. Paste the vacancy text instead.",
  workspaceTabs: "Calculator and analyzed offers",
  calculatorTab: "Calculator",
  closeOffer: "Close",
  offerAnalysis: "OFFER ANALYSIS",
  untitledOffer: "Untitled offer",
  parsedFromJobPost: "Parsed from job post",
  parsedFromPastedText: "Parsed from pasted text",
  viewSource: "View source",
  offerSource: "Original vacancy text",
  employment: "Employment",
  salary: "Salary",
  workMode: "Work mode",
  requiredSkills: "Required skills",
  responsibilities: "Responsibilities",
  niceToHave: "Nice to have",
  offerDetails: "Offer details",
  location: "Location",
  seniority: "Seniority",
  experience: "Experience",
  english: "English",
  company: "Company",
  benefits: "Benefits",
  notMentioned: "Not mentioned",
  workModes: { remote: "Remote", hybrid: "Hybrid", onsite: "On-site" },
  salaryPeriod: { hour: "hour", day: "day", month: "month", year: "year" },
  officeDays: (count) => `${count} ${count === 1 ? "day" : "days"} in office`,
  recruiterMessage: (amount, type) =>
    `Hi! I'm currently looking at opportunities in the range of around ${amount} ${type} per month, but I'm flexible depending on the project, team, and growth opportunities. Happy to discuss the details and learn more about the role.`,
}

const pl: Translation = {
  ...en,
  heroTitle: "Sprawdź, ile naprawdę jest warta oferta.",
  heroDescription:
    "Polska 2026 · Porównaj B2B i UoP, oblicz wynagrodzenie od oczekiwanej kwoty netto i negocjuj świadomie.",
  heroDescriptionMobile: "Decyzje B2B ↔ UoP w Polsce w 2026 roku.",
  yourTarget: "TWÓJ CEL",
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
  yourDecision: "Twoja decyzja",
  toTakeHome: "Aby otrzymać",
  perMonth: "/ miesiąc",
  higherCash: "Więcej gotówki",
  moreProtection: "Więcej ochrony",
  invoiceEquivalent: "Odpowiednik faktury",
  grossEquivalent: "Odpowiednik brutto",
  takeHome: "NA RĘKĘ / MIES.",
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
  compareOffers: "Porównaj oferty",
  compareDescription:
    "Dodaj 2–3 oferty i porównaj gotówkę, wartość roczną oraz stawkę godzinową.",
  recruiterTitle: "Wiadomość do rekrutera",
  copyMessage: "Kopiuj wiadomość",
  copied: "Skopiowano!",
  assumptionsTitle: "Przejrzyste założenia",
  rulesExample: "Zasady 2026 · średnia roczna",
  ratesDaily: "Kursy NBP · aktualizacja codzienna",
  transparentAssumptions: "Przejrzyste założenia",
  estimateAdvice: "Szacunek, nie porada podatkowa",
  sendFeedback: "Prześlij opinię",
  backToCalculator: "Wróć do kalkulatora",
  compareSubtitle:
    "Sprawdź, która oferta daje więcej po podatku, rocznie i za godzinę.",
  yourOffers: "TWOJE OFERTY",
  editOffers: "Edytuj oferty do porównania",
  upToThree: "Maksymalnie 3 oferty",
  addOffer: "Dodaj kolejną ofertę",
  bestTakeHome: "NAJLEPSZE NETTO",
  winsBy: "wygrywa o",
  aheadBy: "ma przewagę",
  moreEachYear: "więcej netto rocznie.",
  monthly: "miesięcznie",
  versus: "względem",
  share: "Udostępnij",
  shared: "Skopiowano",
  detailedComparison: "Szczegółowe porównanie",
  comparisonBasis: "Ten sam profil · kursy NBP · 160 h / miesiąc",
  swipeOffers: "3 oferty: przesuń kolumny poziomo",
  contractType: "Typ umowy",
  grossMonthly: "Brutto / faktura miesięcznie",
  netMonthly: "Netto miesięcznie",
  netYear: "Netto rocznie",
  hourlyNet: "Netto za godzinę · 160 h / mies.",
  hourlyGross: "Brutto za godzinę · 160 h / mies.",
  currency: "Waluta",
  notes: "Uwagi",
  noNotes: "Brak uwag",
  standardEmployment: "Standardowa umowa o pracę",
  best: "NAJLEPSZA",
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
  removeOffer: "Usuń",
  close: "Zamknij",
  grossLabel: "Brutto",
  netLabel: "Netto",
  invoiceLabel: "faktura",
  takeHomeLabel: "na rękę",
  monthShort: "mies.",
  metric: "METRYKA",
  polandRules: "Polska · zasady 2026",
  fallbackRates: "kursy zapasowe",
  loadingCalculator: "Ładowanie kalkulatora",
  of: "Z",
  offerLabel: "Oferta",
  ryczaltTerm: "ryczałt",
  standardUop: "Standardowa UoP",
  commuterUop: "UoP z dojazdem",
  jobXRay: "PRZEŚWIETL OFERTĘ",
  analyzeAnyVacancy: "Przeanalizuj dowolną ofertę",
  vacancyPlaceholder: "Wklej link lub treść oferty",
  analyzeOffer: "Analizuj ofertę",
  analyzingOffer: "Analizowanie…",
  jobAnalysisLimit: "Osiągnięto limit 3 ofert",
  jobAnalysisInvalid: "Wklej link do oferty lub dłuższy opis stanowiska.",
  jobAnalysisTooLarge: "Ta oferta jest zbyt duża do analizy.",
  jobAnalysisPasteFallback:
    "Nie udało się odczytać strony. Wklej treść oferty.",
  workspaceTabs: "Kalkulator i przeanalizowane oferty",
  calculatorTab: "Kalkulator",
  closeOffer: "Zamknij",
  offerAnalysis: "ANALIZA OFERTY",
  untitledOffer: "Oferta bez nazwy",
  parsedFromJobPost: "Dane z ogłoszenia",
  parsedFromPastedText: "Dane z wklejonego tekstu",
  viewSource: "Zobacz źródło",
  offerSource: "Oryginalna treść oferty",
  employment: "Zatrudnienie",
  salary: "Wynagrodzenie",
  workMode: "Tryb pracy",
  requiredSkills: "Wymagane umiejętności",
  responsibilities: "Obowiązki",
  niceToHave: "Mile widziane",
  offerDetails: "Szczegóły oferty",
  location: "Lokalizacja",
  seniority: "Poziom",
  experience: "Doświadczenie",
  english: "Angielski",
  company: "Firma",
  benefits: "Benefity",
  notMentioned: "Nie podano",
  workModes: { remote: "Zdalnie", hybrid: "Hybrydowo", onsite: "Stacjonarnie" },
  salaryPeriod: { hour: "godz.", day: "dzień", month: "miesiąc", year: "rok" },
  officeDays: (count) => `${count} ${count === 1 ? "dzień" : "dni"} w biurze`,
  recruiterMessage: (amount, type) =>
    `Dzień dobry! Interesują mnie oferty w przedziale około ${amount} ${type} miesięcznie, ale jestem elastyczny w zależności od projektu, zespołu i możliwości rozwoju. Chętnie omówię szczegóły stanowiska.`,
}

const ua: Translation = {
  ...en,
  heroTitle: "Дізнайтеся реальну вартість пропозиції.",
  heroDescription:
    "Польща 2026 · Порівнюйте B2B та UoP, рахуйте від бажаного доходу й упевнено ведіть переговори.",
  heroDescriptionMobile: "Рішення B2B ↔ UoP у Польщі 2026.",
  yourTarget: "ВАША ЦІЛЬ",
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
  yourDecision: "Ваше рішення",
  toTakeHome: "Щоб отримувати",
  perMonth: "/ місяць",
  higherCash: "Більше коштів",
  moreProtection: "Більше захисту",
  invoiceEquivalent: "Еквівалент інвойсу",
  grossEquivalent: "Еквівалент брутто",
  takeHome: "НА РУКИ / МІС.",
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
  compareOffers: "Порівняти пропозиції",
  compareDescription:
    "Додайте 2–3 пропозиції та порівняйте дохід, річну суму й погодинну ставку.",
  recruiterTitle: "Повідомлення рекрутеру",
  copyMessage: "Копіювати повідомлення",
  copied: "Скопійовано!",
  assumptionsTitle: "Прозорі припущення",
  rulesExample: "Правила 2026 · середнє за рік",
  ratesDaily: "Курси NBP · щоденне оновлення",
  transparentAssumptions: "Прозорі припущення",
  estimateAdvice: "Оцінка, не податкова консультація",
  sendFeedback: "Надіслати відгук",
  backToCalculator: "Назад до калькулятора",
  compareSubtitle:
    "Дізнайтеся, яка пропозиція дає більше після податків, за рік і за годину.",
  yourOffers: "ВАШІ ПРОПОЗИЦІЇ",
  editOffers: "Редагуйте пропозиції для порівняння",
  upToThree: "До 3 пропозицій",
  addOffer: "Додати пропозицію",
  bestTakeHome: "НАЙКРАЩЕ НЕТТО",
  winsBy: "виграє на",
  aheadBy: "попереду на",
  moreEachYear: "більше чистого доходу на рік.",
  monthly: "щомісяця",
  versus: "проти",
  share: "Поділитися",
  shared: "Скопійовано",
  detailedComparison: "Детальне порівняння",
  comparisonBasis: "Один профіль · курси NBP · 160 год / місяць",
  swipeOffers: "3 пропозиції: гортайте колонки горизонтально",
  contractType: "Тип контракту",
  grossMonthly: "Брутто / інвойс на місяць",
  netMonthly: "Нетто на місяць",
  netYear: "Нетто на рік",
  hourlyNet: "Нетто за годину · 160 год / міс.",
  hourlyGross: "Брутто за годину · 160 год / міс.",
  currency: "Валюта",
  notes: "Примітки",
  noNotes: "Без приміток",
  standardEmployment: "Стандартний трудовий договір",
  best: "НАЙКРАЩА",
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
  removeOffer: "Видалити",
  close: "Закрити",
  grossLabel: "Брутто",
  netLabel: "Нетто",
  invoiceLabel: "інвойс",
  takeHomeLabel: "на руки",
  monthShort: "міс.",
  metric: "ПОКАЗНИК",
  polandRules: "Польща · правила 2026",
  fallbackRates: "резервні курси",
  loadingCalculator: "Завантаження калькулятора",
  of: "З",
  offerLabel: "Пропозиція",
  ryczaltTerm: "ричалт",
  standardUop: "Стандартна UoP",
  commuterUop: "UoP з витратами на проїзд",
  jobXRay: "АНАЛІЗ ВАКАНСІЇ",
  analyzeAnyVacancy: "Проаналізуйте будь-яку вакансію",
  vacancyPlaceholder: "Вставте посилання або текст вакансії",
  analyzeOffer: "Аналізувати пропозицію",
  analyzingOffer: "Аналізуємо…",
  jobAnalysisLimit: "Досягнуто ліміт у 3 пропозиції",
  jobAnalysisInvalid: "Вставте посилання або довший опис вакансії.",
  jobAnalysisTooLarge: "Ця вакансія завелика для аналізу.",
  jobAnalysisPasteFallback:
    "Не вдалося прочитати сторінку. Вставте текст вакансії.",
  workspaceTabs: "Калькулятор і проаналізовані пропозиції",
  calculatorTab: "Калькулятор",
  closeOffer: "Закрити",
  offerAnalysis: "АНАЛІЗ ПРОПОЗИЦІЇ",
  untitledOffer: "Пропозиція без назви",
  parsedFromJobPost: "Дані з вакансії",
  parsedFromPastedText: "Дані зі вставленого тексту",
  viewSource: "Переглянути джерело",
  offerSource: "Оригінальний текст вакансії",
  employment: "Зайнятість",
  salary: "Зарплата",
  workMode: "Формат роботи",
  requiredSkills: "Обов’язкові навички",
  responsibilities: "Обов’язки",
  niceToHave: "Буде перевагою",
  offerDetails: "Деталі пропозиції",
  location: "Локація",
  seniority: "Рівень",
  experience: "Досвід",
  english: "Англійська",
  company: "Компанія",
  benefits: "Бенефіти",
  notMentioned: "Не вказано",
  workModes: { remote: "Віддалено", hybrid: "Гібридно", onsite: "В офісі" },
  salaryPeriod: { hour: "год.", day: "день", month: "місяць", year: "рік" },
  officeDays: (count) => `${count} ${count === 1 ? "день" : "дні"} в офісі`,
  recruiterMessage: (amount, type) =>
    `Вітаю! Я розглядаю можливості в діапазоні близько ${amount} ${type} на місяць, але готовий обговорювати умови залежно від проєкту, команди та можливостей розвитку. Буду радий дізнатися більше про роль.`,
}

export const translations: Record<Lang, Translation> = { en, pl, ua }
