import type { TaxBracket, TaxProfile, TaxYearRules } from "../../config/tax"

export function assertAmount(value: number): void {
  if (!Number.isFinite(value) || value < 0 || value > Number.MAX_SAFE_INTEGER / 100) {
    throw new RangeError("Amount must be a finite, non-negative PLN value")
  }
}

/** Fractional PLN retained for estimates; payroll rounding is not modelled. */
export function progressiveTax(base: number, brackets: readonly TaxBracket[], reduction = 0): number {
  let lower = 0
  let tax = 0
  for (const bracket of brackets) {
    tax += Math.max(0, Math.min(base, bracket.maxAnnual) - lower) * bracket.rate
    lower = bracket.maxAnnual
    if (base <= lower) break
  }
  return Math.max(0, tax - reduction)
}

export function b2bContributions(profile: TaxProfile["b2b"], rules: TaxYearRules) {
  const zus = rules.b2b.zus[profile.zusProfile]
  if (!zus || !rules.b2b.ryczaltRates.includes(profile.ryczaltRate)) throw new RangeError("Unsupported B2B tax profile")
  return {
    socialZUS: zus.socialMonthly + (profile.sicknesInsurance ? zus.sicknessMonthly : 0),
    labourFund: zus.labourFundMonthly,
  }
}

export function b2bHealthMonthly(revenueAfterSocial: number, rules: TaxYearRules): number {
  const tier = rules.b2b.health.find((item) => revenueAfterSocial <= item.maxAnnual)
  if (!tier) throw new RangeError("No health contribution tier for this revenue")
  return tier.monthly
}

export function uopMonth(gross: number, profile: TaxProfile["uop"], rules: TaxYearRules, previousGross = 0, previousTaxable = 0) {
  assertAmount(gross)
  const kup = rules.uop.kup[profile.kupType]
  if (kup === undefined) throw new RangeError("Unsupported UoP tax profile")
  const rates = rules.uop.socialContributions
  const cappedBase = Math.min(gross, Math.max(0, rules.uop.socialContributionAnnualLimit - previousGross))
  const pension = cappedBase * rates.pension
  const disability = cappedBase * rates.disability
  const sickness = gross * rates.sickness
  const socialContributions = pension + disability + sickness
  const healthBase = Math.max(0, gross - socialContributions)
  const employeePpk = profile.ppkEnabled ? gross * rules.uop.ppk.employeeContribution : 0
  const employerPpk = profile.ppkEnabled ? gross * rules.uop.ppk.employerContribution : 0
  const taxableIncome = Math.max(0, healthBase + employerPpk - (gross > 0 ? kup : 0))
  const reference = rules.uop.healthCapReference
  const referenceBase = Math.max(0, Math.round(healthBase - kup))
  const lowerBase = Math.min(referenceBase, Math.max(0, reference.threshold - previousTaxable))
  const healthCap = Math.max(0,
    lowerBase * reference.lowerRate + (referenceBase - lowerBase) * reference.upperRate
      - (previousTaxable <= reference.threshold ? reference.monthlyReduction : 0),
  )
  const healthContribution = Math.min(healthBase * rules.uop.healthRate, healthCap)
  return { gross, pension, disability, sickness, socialContributions, healthContribution, employeePpk, employerPpk, taxableIncome }
}
