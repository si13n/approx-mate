import TAX_CONFIG_2026 from "@/config/tax.config";

const config = TAX_CONFIG_2026;

export function b2bGrossToNet(grossMonthlyPLN: number): number {
  const annual = grossMonthlyPLN * 12;

  let zdrowotna = config.b2b.zdrowotnaMonthly[config.b2b.zdrowotnaMonthly.length - 1].monthlyRate;
  for (const bracket of config.b2b.zdrowotnaMonthly) {
    if (annual <= bracket.annualThreshold) {
      zdrowotna = bracket.monthlyRate;
      break;
    }
  }

  const tax = config.b2b.ryczaltRate * grossMonthlyPLN;
  return grossMonthlyPLN - tax - zdrowotna;
}

export function b2bNetToGross(netMonthlyPLN: number): number {
  let lo = netMonthlyPLN * 0.9,
    hi = netMonthlyPLN * 2.5;
  for (let i = 0; i < 64; i++) {
    const mid = (lo + hi) / 2;
    if (b2bGrossToNet(mid) < netMonthlyPLN) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export function uopGrossToNet(bruttoMonthlyPLN: number): number {
  const zusEmp = config.uop.zusEmployeeRate * bruttoMonthlyPLN;
  const zusBase = bruttoMonthlyPLN - zusEmp;
  const zdrowotna = config.uop.zdrowotnaRate * zusBase;
  const kup = config.uop.kup;
  const taxBase = zusBase - kup;

  let incomeTax = 0;
  const brackets = config.uop.taxBrackets;

  if (taxBase > brackets[1].threshold) {
    incomeTax = (brackets[1].threshold - brackets[0].threshold) * brackets[0].rate + (taxBase - brackets[1].threshold) * brackets[2].rate;
  } else if (taxBase > brackets[0].threshold) {
    incomeTax = (taxBase - brackets[0].threshold) * brackets[0].rate;
  }

  return bruttoMonthlyPLN - zusEmp - zdrowotna - incomeTax;
}

export function uopNetToGross(netMonthlyPLN: number): number {
  let lo = netMonthlyPLN * 0.9,
    hi = netMonthlyPLN * 3;
  for (let i = 0; i < 64; i++) {
    const mid = (lo + hi) / 2;
    if (uopGrossToNet(mid) < netMonthlyPLN) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export const createCalculationEngine = (rates: Record<string, number>) => {
  function toPLN(amount: number, from: "PLN" | "USD" | "EUR"): number {
    const key = `${from}_PLN`;
    return amount * (rates[key] ?? 1);
  }

  function fromPLN(amountPLN: number, to: "PLN" | "USD" | "EUR"): number {
    const key = `${to}_PLN`;
    return amountPLN / (rates[key] ?? 1);
  }

  return { toPLN, fromPLN };
};
