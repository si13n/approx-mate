/**
 * Polish tax rules for 2026
 *
 * All values verified against official sources:
 * - ZUS (Zakład Ubezpieczeń Społecznych)
 * - podatki.gov.pl (Ministry of Finance)
 * - NBP (exchange rates)
 *
 * Last verified: August 2026
 */

export const TAX_2026 = {
  year: 2026,

  // ── B2B (Ryczałt) ─────────────────────────────────────────────
  b2b: {
    ryczaltRates: [0.085, 0.12, 0.14, 0.15, 0.17],
    defaultRate: 0.12,

    zus: {
      ulgaNaStart: {
        name: "Ulga na start",
        socialMonthly: 0,
        socialWithSickness: 0,
        description: "Zero social contributions for first months",
      },
      preferential: {
        name: "Preferential ZUS",
        contributionBase: 1441.8,
        socialMonthly: 420.86,
        socialWithSickness: 456.18,
      },
      full: {
        name: "Full ZUS",
        contributionBase: 5652,
        socialMonthly: 1788.29,
        socialWithSickness: 1926.76,
      },
    },

    sickness: {
      rate: 0.0245, // 2.45%
      description: "Voluntary sickness insurance (składka chorobowa)",
    },

    // Health contributions (determined by annual revenue)
    health: {
      tier1: { maxAnnual: 60000, monthly: 498.35 },
      tier2: { maxAnnual: 300000, monthly: 830.58 },
      tier3: { maxAnnual: Infinity, monthly: 1495.04 },
      description: "Automatically calculated based on annual revenue",
    },

    taxBase: "revenue - socialZUS - (healthZUS × 0.5)",
  },

  // ── UoP (Employment) ────────────────────────────────────────────
  uop: {
    taxBrackets: [
      { maxAnnual: 120000, rate: 0.12 },
      { maxAnnual: Infinity, rate: 0.32 },
    ],
    taxReductionAmount: 3600, // annual

    socialContributions: {
      pension: 0.0976, // ZUS emerytalne
      disability: 0.015, // ZUS rentowe
      sickness: 0.0245, // ZUS chorobowa
      accidental: 0.0167, // ZUS wypadkowe
      healthcare: 0.09, // Zdrowotna (calculated on reduced base)
    },

    // Tax-deductible employee costs
    kup: {
      standard: 250,
      commuter: 300,
      default: 250,
      description: "Tax-deductible employee costs (koszty uzyskania przychodu)",
    },

    // Pension fund savings (PPK)
    ppk: {
      employeeContribution: 0.02, // 2%
      employerContribution: 0.015, // 1.5%
      default: false,
      description: "Pracowniczy Plan Kapitałowy (voluntary)",
    },

    // Annual ZUS contribution limits
    socialContributionAnnualLimit: 282600,
  },

  // ── Exchange rates ─────────────────────────────────────────────
  exchangeRates: {
    PLN_PLN: 1,
    USD_PLN: 3.85,
    EUR_PLN: 4.25,
    source: "NBP",
  },

  // ── Metadata ───────────────────────────────────────────────────
  metadata: {
    lastVerified: "2026-08-20",
    sources: [
      "https://www.podatki.gov.pl/ (Ministry of Finance)",
      "https://www.zus.pl/ (ZUS)",
      "https://www.ppk.gov.pl/ (PPK)",
    ],
  },
} as const;

// ── Type definitions ─────────────────────────────────────────────
export type B2BZUSProfile = keyof typeof TAX_2026.b2b.zus;
export type UoPKUPType = "standard" | "commuter";

export interface TaxProfile {
  b2b: {
    ryczaltRate: number;
    zusProfile: B2BZUSProfile;
    sicknesInsurance: boolean;
  };
  uop: {
    kupType: UoPKUPType;
    ppkEnabled: boolean;
  };
}

export const DEFAULT_TAX_PROFILE: TaxProfile = {
  b2b: {
    ryczaltRate: TAX_2026.b2b.defaultRate,
    zusProfile: "full",
    sicknesInsurance: false,
  },
  uop: {
    kupType: "standard",
    ppkEnabled: false,
  },
};
