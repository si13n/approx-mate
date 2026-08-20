/**
 * Tax calculation engine using the configured tax profile.
 *
 * All calculations follow Polish tax law as of 2026.
 * Uses annual-first model where required by law.
 */

import { TAX_2026, TaxProfile } from "../config/tax";

// ── Result types ───────────────────────────────────────────────────────────

export interface B2BCalculationResult {
  monthlyGross: number;
  monthlyNet: number;
  annualGross: number;
  annualNet: number;
  socialZUS: number;
  healthContribution: number;
  incomeTax: number;
  effectiveMonthlyRate: number;
}

export interface UoPCalculationResult {
  monthlyGross: number;
  monthlyNet: number;
  annualGross: number;
  annualNet: number;
  socialContributions: number;
  healthContribution: number;
  incomeTax: number;
  effectiveMonthlyRate: number;
}

// ── B2B Calculations ───────────────────────────────────────────────────────

export function calculateB2BFromGross(
  monthlyGrossPLN: number,
  profile: TaxProfile
): B2BCalculationResult {
  const annualGross = monthlyGrossPLN * 12;

  // Get ZUS profile
  const zusProfile = profile.b2b.zusProfile;
  const zusConfig = TAX_2026.b2b.zus[zusProfile];

  // Calculate social ZUS
  let socialZUS = 0;
  let sicknesContribution = 0;

  if (zusProfile === "full") {
    socialZUS = zusConfig.socialMonthly;
    if (profile.b2b.sicknesInsurance) {
      sicknesContribution = zusConfig.socialWithSickness - zusConfig.socialMonthly;
    }
  } else if (zusProfile === "preferential") {
    socialZUS = zusConfig.socialMonthly;
    if (profile.b2b.sicknesInsurance) {
      sicknesContribution = zusConfig.socialWithSickness - zusConfig.socialMonthly;
    }
  }
  // For ulgaNaStart, socialZUS stays at 0

  const monthlyTotalSocial = socialZUS + sicknesContribution;

  // Determine health contribution tier based on annual revenue
  const annualRevenue = annualGross;
  let healthMonthly: number;

  if (annualRevenue <= TAX_2026.b2b.health.tier1.maxAnnual) {
    healthMonthly = TAX_2026.b2b.health.tier1.monthly;
  } else if (annualRevenue <= TAX_2026.b2b.health.tier2.maxAnnual) {
    healthMonthly = TAX_2026.b2b.health.tier2.monthly;
  } else {
    healthMonthly = TAX_2026.b2b.health.tier3.monthly;
  }

  const annualHealth = healthMonthly * 12;

  // Calculate taxable base: revenue - social ZUS - (50% of health)
  const annualTaxableBase =
    annualGross - monthlyTotalSocial * 12 - annualHealth * 0.5;

  // Calculate income tax
  const annualIncomeTax = Math.max(0, annualTaxableBase * profile.b2b.ryczaltRate);

  // Calculate annual net
  const annualNet = annualGross - monthlyTotalSocial * 12 - annualHealth - annualIncomeTax;
  const monthlyNet = annualNet / 12;

  return {
    monthlyGross: monthlyGrossPLN,
    monthlyNet,
    annualGross,
    annualNet,
    socialZUS: monthlyTotalSocial,
    healthContribution: healthMonthly,
    incomeTax: annualIncomeTax / 12,
    effectiveMonthlyRate: monthlyNet,
  };
}

export function calculateB2BFromNet(
  targetMonthlyNetPLN: number,
  profile: TaxProfile,
  maxIterations = 64
): B2BCalculationResult {
  // Binary search for the required gross
  let lo = targetMonthlyNetPLN * 0.5;
  let hi = targetMonthlyNetPLN * 3;

  for (let i = 0; i < maxIterations; i++) {
    const mid = (lo + hi) / 2;
    const result = calculateB2BFromGross(mid, profile);

    if (result.monthlyNet < targetMonthlyNetPLN) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  const gross = (lo + hi) / 2;
  return calculateB2BFromGross(gross, profile);
}

// ── UoP Calculations ───────────────────────────────────────────────────────

export function calculateUoPFromGross(
  monthlyGrossPLN: number,
  profile: TaxProfile
): UoPCalculationResult {
  const annualGross = monthlyGrossPLN * 12;

  // Get contribution rates from config
  const rates = TAX_2026.uop.socialContributions;

  // Calculate annual employee ZUS (with cap)
  const pensionBase = Math.min(annualGross, TAX_2026.uop.socialContributionAnnualLimit);
  const disabilityBase = Math.min(annualGross, TAX_2026.uop.socialContributionAnnualLimit);

  const annualPension = pensionBase * rates.pension;
  const annualDisability = disabilityBase * rates.disability;
  const annualSickness = annualGross * rates.sickness;
  const annualAccident = annualGross * rates.accidental;

  const annualEmployeeSocial = annualPension + annualDisability + annualSickness + annualAccident;

  // Calculate health contribution (9% of reduced base)
  const healthBase = annualGross - annualPension - annualDisability;
  const annualHealth = Math.max(0, healthBase * rates.healthcare);

  // Calculate PIT (income tax)
  const kupMonthly = profile.uop.kupType === "standard" ? TAX_2026.uop.kup.standard : TAX_2026.uop.kup.commuter;
  const annualKUP = kupMonthly * 12;
  const taxableAnnual = Math.max(0, annualGross - annualPension - annualDisability - annualKUP);

  let annualPIT = 0;
  for (const bracket of TAX_2026.uop.taxBrackets) {
    const taxableInBracket = Math.min(taxableAnnual, bracket.maxAnnual) - annualPIT / bracket.rate;
    if (taxableInBracket > 0) {
      annualPIT += taxableInBracket * bracket.rate;
    }
  }

  // Apply tax reduction
  const taxReduction = TAX_2026.uop.taxReductionAmount;
  annualPIT = Math.max(0, annualPIT - taxReduction);

  // PPK contributions (if enabled)
  let annualPPKEmployee = 0;
  if (profile.uop.ppkEnabled) {
    annualPPKEmployee = annualGross * TAX_2026.uop.ppk.employeeContribution;
  }

  // Calculate annual net
  const annualNet = annualGross - annualEmployeeSocial - annualHealth - annualPIT - annualPPKEmployee;
  const monthlyNet = annualNet / 12;

  return {
    monthlyGross: monthlyGrossPLN,
    monthlyNet,
    annualGross,
    annualNet,
    socialContributions: annualEmployeeSocial / 12,
    healthContribution: annualHealth / 12,
    incomeTax: annualPIT / 12,
    effectiveMonthlyRate: monthlyNet,
  };
}

export function calculateUoPFromNet(
  targetMonthlyNetPLN: number,
  profile: TaxProfile,
  maxIterations = 64
): UoPCalculationResult {
  // Binary search for the required gross
  let lo = targetMonthlyNetPLN * 0.7;
  let hi = targetMonthlyNetPLN * 2;

  for (let i = 0; i < maxIterations; i++) {
    const mid = (lo + hi) / 2;
    const result = calculateUoPFromGross(mid, profile);

    if (result.monthlyNet < targetMonthlyNetPLN) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  const gross = (lo + hi) / 2;
  return calculateUoPFromGross(gross, profile);
}
