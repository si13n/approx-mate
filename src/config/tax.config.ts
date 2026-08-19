export interface TaxConfig {
  year: number;
  uop: {
    zusEmployeeRate: number;
    zdrowotnaRate: number;
    zdrowotnaBase: string;
    kup: number;
    taxBrackets: Array<{
      threshold: number;
      rate: number;
    }>;
  };
  b2b: {
    ryczaltRate: number;
    zdrowotnaMonthly: Array<{
      annualThreshold: number;
      monthlyRate: number;
    }>;
  };
}

export const TAX_CONFIG_2026: TaxConfig = {
  year: 2026,
  uop: {
    zusEmployeeRate: 0.1371,
    zdrowotnaRate: 0.09,
    zdrowotnaBase: "grossMinusZus",
    kup: 250,
    taxBrackets: [
      { threshold: 2500, rate: 0.12 },
      { threshold: 10000, rate: 0.12 },
      { threshold: Infinity, rate: 0.32 },
    ],
  },
  b2b: {
    ryczaltRate: 0.12,
    zdrowotnaMonthly: [
      { annualThreshold: 60000, monthlyRate: 463 },
      { annualThreshold: 300000, monthlyRate: 772 },
      { annualThreshold: Infinity, monthlyRate: 1389 },
    ],
  },
};

export default TAX_CONFIG_2026;
