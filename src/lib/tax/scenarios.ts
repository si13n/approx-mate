import { CURRENT_TAX_YEAR, getTaxRules, type TaxProfile } from "../../config/tax"
import { assertAmount, b2bContributions, b2bHealthMonthly, progressiveTax, uopMonth } from "./core"

export interface TaxScenarioMonth {
  gross: number
  profile: TaxProfile
  /** False means no contract/business; zero revenue alone does not. */
  active?: boolean
}
function validateYear(months: readonly TaxScenarioMonth[]) {
  if (months.length !== 12) throw new RangeError("A tax-year scenario must contain January through December")
  for (const month of months) {
    assertAmount(month.gross)
    if (month.active === false && month.gross !== 0) throw new RangeError("Inactive months cannot contain income")
  }
}
export function constantIncomeYear(gross: number, profile: TaxProfile): TaxScenarioMonth[] {
  assertAmount(gross)
  return Array.from({ length: 12 }, () => ({ gross, profile }))
}

/** Annual-average model. Rows expose contribution bases, not monthly payslips. */
export function calculateUoPScenario(months: readonly TaxScenarioMonth[], year = CURRENT_TAX_YEAR) {
  validateYear(months)
  const rules = getTaxRules(year)
  let annualGross = 0
  let taxableIncome = 0
  const rows = months.map((month, index) => {
    const row = uopMonth(month.gross, month.profile.uop, rules, annualGross, taxableIncome)
    annualGross += month.gross
    taxableIncome += row.taxableIncome
    return { month: index + 1, ...row }
  })
  const socialContributions = rows.reduce((sum, row) => sum + row.socialContributions, 0)
  const healthContribution = rows.reduce((sum, row) => sum + row.healthContribution, 0)
  const employeePpk = rows.reduce((sum, row) => sum + row.employeePpk, 0)
  const employerPpk = rows.reduce((sum, row) => sum + row.employerPpk, 0)
  const incomeTax = progressiveTax(taxableIncome, rules.uop.taxBrackets, rules.uop.taxReductionAmount)
  return {
    year, months: rows, annualGross, taxableIncome, socialContributions, healthContribution, employeePpk, employerPpk, incomeTax,
    annualNet: annualGross - socialContributions - healthContribution - employeePpk - incomeTax,
  }
}

/**
 * Provisioned annual estimate: final health tier applies to every active month.
 * Contributions assumed paid in the modelled year. This does not calculate
 * payment dates or next-year tax deductions from a health settlement.
 */
export function calculateB2BScenario(months: readonly TaxScenarioMonth[], year = CURRENT_TAX_YEAR) {
  validateYear(months)
  const rules = getTaxRules(year)
  const rows = months.map((month, index) => ({
    month: index + 1,
    gross: month.gross,
    active: month.active !== false,
    rate: month.profile.b2b.ryczaltRate,
    ...(month.active === false ? { socialZUS: 0, labourFund: 0 } : b2bContributions(month.profile.b2b, rules)),
  }))
  const activeRows = rows.filter((row) => row.active)
  // Rate changes require allocation of deductions between revenue types.
  if (new Set(activeRows.map((row) => row.rate)).size > 1) throw new RangeError("Use one ryczalt rate per tax-year scenario")
  const annualGross = rows.reduce((sum, row) => sum + row.gross, 0)
  const socialZUS = rows.reduce((sum, row) => sum + row.socialZUS, 0)
  const labourFund = rows.reduce((sum, row) => sum + row.labourFund, 0)
  const revenueForHealthTier = Math.max(0, annualGross - socialZUS)
  const healthMonthly = b2bHealthMonthly(revenueForHealthTier, rules)
  const healthContribution = activeRows.length * healthMonthly
  const taxableIncome = Math.max(0, annualGross - socialZUS - healthContribution * rules.b2b.healthDeductionFraction)
  const incomeTax = taxableIncome * (activeRows[0]?.rate ?? 0)
  return {
    year,
    months: rows.map((row) => ({ ...row, healthProvision: row.active ? healthMonthly : 0 })),
    annualGross, socialZUS, labourFund, revenueForHealthTier, healthContribution, taxableIncome, incomeTax,
    annualNet: annualGross - socialZUS - labourFund - healthContribution - incomeTax,
  }
}
