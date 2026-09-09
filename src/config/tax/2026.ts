import type { TaxYearRules } from "./types"

/** Verified inputs for the supported estimate; not a full payroll ruleset. */
export const TAX_2026 = {
  year: 2026,
  effectiveFrom: "2026-01-01",
  effectiveTo: "2026-12-31",
  verifiedOn: "2026-09-09",
  b2b: {
    ryczaltRates: [0.085, 0.12, 0.14, 0.15, 0.17],
    defaultRate: 0.12,
    // Social insurance ONLY. FP/FS is a separate, non-deductible payment.
    zus: {
      ulgaNaStart: { socialMonthly: 0, sicknessMonthly: 0, labourFundMonthly: 0 },
      preferential: { socialMonthly: 420.86, sicknessMonthly: 35.32, labourFundMonthly: 0 },
      full: { socialMonthly: 1649.82, sicknessMonthly: 138.47, labourFundMonthly: 138.47 },
    },
    health: [
      { maxAnnual: 60000, monthly: 498.35 },
      { maxAnnual: 300000, monthly: 830.58 },
      { maxAnnual: Infinity, monthly: 1495.04 },
    ],
    healthDeductionFraction: 0.5,
  },
  uop: {
    taxBrackets: [
      { maxAnnual: 120000, rate: 0.12 },
      { maxAnnual: Infinity, rate: 0.32 },
    ],
    taxReductionAmount: 3600,
    // Accident insurance is financed entirely by the employer.
    socialContributions: { pension: 0.0976, disability: 0.015, sickness: 0.0245 },
    healthRate: 0.09,
    socialContributionAnnualLimit: 282600,
    kup: { standard: 250, commuter: 300 },
    ppk: { employeeContribution: 0.02, employerContribution: 0.015 },
    // Article 83 refers to 31 Dec 2021; not another supported tax year.
    healthCapReference: { lowerRate: 0.17, upperRate: 0.32, threshold: 85528, monthlyReduction: 43.76 },
  },
  sources: {
    pit: "https://www.podatki.gov.pl/podatki-firmowe/pit/stawki-i-limity",
    employeeCosts: "https://www.podatki.gov.pl/podatki-osobiste/pit/informacje-podstawowe/co-jest-opodatkowane/dochody-z-pracy",
    contributions: "https://www.zus.pl/firmy/rozliczenia-z-zus/skladki-na-ubezpieczenia",
    employeeContributions: "https://www.zus.pl/documents/10182/167561/Jestes_pracownikiem.pdf/a049dc44-6680-4a0e-b07a-60adc7dc01eb",
    employeeHealth: "https://www.zus.pl/pracujacy/ubezpieczenie-zdrowotne-w-polsce/podstawa-wymiaru-skladek-na-ubezpieczenie-zdrowotne",
    healthCap: "https://www.zus.pl/o-zus/o-nas/programy-transformacji-cyfrowej-zus/zmiany-od-2022-r./zmiany-w-skladce-zdrowotnej",
    healthDeduction: "https://www.podatki.gov.pl/ulgi-i-odliczenia/odliczenie-skladek-na-ubezpieczenie-zdrowotne-pit",
    labourFundDeduction: "https://www.biznes.gov.pl/pl/portal/00230",
    employerPpkTax: "https://www.mojeppk.pl/faq/pracownik/podatki-i-skladki-zus_jaki-podatek-zaplaci-pracownik-od-wplaty-pracodawcy.html",
    ppkRates: "https://www.mojeppk.pl/dla-pracownika/artykul.html",
  },
} as const satisfies TaxYearRules
