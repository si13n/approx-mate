import { TAX_2026 } from "./2026"
import type { TaxProfile, TaxYearRules } from "./types"

export type { TaxProfile, TaxYearRules, TaxBracket, B2BZUSProfile, UoPKUPType } from "./types"
export const CURRENT_TAX_YEAR = 2026
export const TAX_RULES_BY_YEAR: Readonly<Record<number, TaxYearRules>> = { 2026: TAX_2026 }
export function getTaxRules(year: number = CURRENT_TAX_YEAR): TaxYearRules {
  const rules = TAX_RULES_BY_YEAR[year]
  if (!rules) throw new RangeError(`Unsupported tax year: ${year}`)
  return rules
}
export const DEFAULT_TAX_RULES = getTaxRules()
export const DEFAULT_TAX_PROFILE: TaxProfile = {
  b2b: { ryczaltRate: DEFAULT_TAX_RULES.b2b.defaultRate, zusProfile: "full", sicknesInsurance: false },
  uop: { kupType: "standard", ppkEnabled: false },
}
