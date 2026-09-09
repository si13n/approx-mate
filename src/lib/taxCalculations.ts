/** Public calculator API. Monthly values are annual estimates divided by 12. */
import { CURRENT_TAX_YEAR, getTaxRules, type TaxProfile } from "../config/tax"
import { assertAmount, b2bContributions } from "./tax/core"
import { solveGross } from "./tax/inverse"
import { calculateB2BScenario, calculateUoPScenario, constantIncomeYear } from "./tax/scenarios"

interface CalculationResult {
  monthlyGross: number
  monthlyNet: number
  annualGross: number
  annualNet: number
  healthContribution: number
  incomeTax: number
  effectiveMonthlyRate: number
  taxYear: number
}
export interface B2BCalculationResult extends CalculationResult {
  socialZUS: number
  labourFund: number
}
export interface UoPCalculationResult extends CalculationResult {
  socialContributions: number
  ppkContribution: number
  employerPpkContribution: number
}

export function calculateB2BFromGross(monthlyGrossPLN: number, profile: TaxProfile, year = CURRENT_TAX_YEAR): B2BCalculationResult {
  const result = calculateB2BScenario(constantIncomeYear(monthlyGrossPLN, profile), year)
  // The calculator displays available take-home; scenarios preserve losses.
  const annualNet = Math.max(0, result.annualNet)
  return {
    taxYear: year, monthlyGross: monthlyGrossPLN, monthlyNet: annualNet / 12,
    annualGross: result.annualGross, annualNet,
    socialZUS: result.socialZUS / 12, labourFund: result.labourFund / 12,
    healthContribution: result.healthContribution / 12, incomeTax: result.incomeTax / 12,
    effectiveMonthlyRate: annualNet / 12,
  }
}

export function calculateUoPFromGross(monthlyGrossPLN: number, profile: TaxProfile, year = CURRENT_TAX_YEAR): UoPCalculationResult {
  const result = calculateUoPScenario(constantIncomeYear(monthlyGrossPLN, profile), year)
  return {
    taxYear: year, monthlyGross: monthlyGrossPLN, monthlyNet: result.annualNet / 12,
    annualGross: result.annualGross, annualNet: result.annualNet,
    socialContributions: result.socialContributions / 12,
    ppkContribution: result.employeePpk / 12, employerPpkContribution: result.employerPpk / 12,
    healthContribution: result.healthContribution / 12, incomeTax: result.incomeTax / 12,
    effectiveMonthlyRate: result.annualNet / 12,
  }
}

export function calculateB2BFromNet(target: number, profile: TaxProfile, maxIterations = 64, year = CURRENT_TAX_YEAR): B2BCalculationResult {
  assertAmount(target)
  const rules = getTaxRules(year)
  const calculate = (gross: number) => calculateB2BFromGross(gross, profile, year)
  if (target === 0) return calculate(0)
  const { socialZUS } = b2bContributions(profile.b2b, rules)
  let minimum = 0
  // Ryczałt net drops at health thresholds. Search tiers in order so a second
  // solution above a threshold cannot hide a cheaper valid solution below it.
  for (const tier of rules.b2b.health) {
    const maximum = tier.maxAnnual / 12 + socialZUS
    // Stay just inside the inclusive tier, avoiding floating-point spillover.
    const safeMaximum = Number.isFinite(maximum) ? maximum - 1e-8 : maximum
    const result = solveGross(target, calculate, minimum, safeMaximum, maxIterations)
    if (result) return result
    if (Number.isFinite(maximum)) {
      const boundary = calculate(maximum)
      if (boundary.monthlyNet >= target && boundary.monthlyNet - target <= 0.01) return boundary
    }
    minimum = maximum + 1e-8
  }
  throw new RangeError("Unable to reach target net")
}

export function calculateUoPFromNet(target: number, profile: TaxProfile, maxIterations = 64, year = CURRENT_TAX_YEAR): UoPCalculationResult {
  const result = solveGross(target, (gross) => calculateUoPFromGross(gross, profile, year), 0, Infinity, maxIterations)
  if (!result) throw new RangeError("Unable to reach target net")
  return result
}
