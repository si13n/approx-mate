import { describe, expect, it } from "vitest"
import { DEFAULT_TAX_PROFILE, type TaxProfile } from "../../config/tax"
import { calculateB2BScenario, calculateUoPScenario, constantIncomeYear } from "./scenarios"

const profile = DEFAULT_TAX_PROFILE

describe("Monthly scenarios within a tax year", () => {
  it("caps pension and disability in the exact crossing month, keeping sickness uncapped", () => {
    const year = calculateUoPScenario(constantIncomeYear(30000, profile))
    expect(year.months[8].pension).toBe(2928)
    // 282600 annual cap - 9 * 30000 = 12600 remaining in October.
    expect(year.months[9].pension).toBeCloseTo(1229.76, 6)
    expect(year.months[9].disability).toBe(189)
    expect(year.months[10].pension).toBe(0)
    expect(year.months[10].disability).toBe(0)
    expect(year.months[10].sickness).toBe(735)
    expect(year.annualNet).toBeCloseTo(216981.9516, 6)
  })
  it("handles variable income and gives the same annual PIT base before the cap", () => {
    const input = constantIncomeYear(10000, profile).map((month, i) => ({ ...month, gross: i < 6 ? 5000 : 15000 }))
    const year = calculateUoPScenario(input)
    expect(year.annualGross).toBe(120000)
    expect(year.socialContributions).toBeCloseTo(16452, 6)
    expect(year.taxableIncome).toBeCloseTo(100548, 6)
    expect(year.incomeTax).toBeCloseTo(8465.76, 6)
    expect(year.annualNet).toBeCloseTo(85762.92, 6)
  })
  it("takes explicit ZUS changes instead of pretending a relief lasts all year", () => {
    const start: TaxProfile = { ...profile, b2b: { ...profile.b2b, zusProfile: "ulgaNaStart" } }
    const preferential: TaxProfile = { ...profile, b2b: { ...profile.b2b, zusProfile: "preferential" } }
    const input = constantIncomeYear(10000, start).map((month, i) => ({ ...month, profile: i < 6 ? start : preferential }))
    const year = calculateB2BScenario(input)
    expect(year.months[5].socialZUS).toBe(0)
    expect(year.months[6].socialZUS).toBe(420.86)
    expect(year.socialZUS).toBeCloseTo(2525.16, 6)
    expect(year.labourFund).toBe(0)
    expect(year.healthContribution).toBeCloseTo(9966.96, 6)
    expect(year.incomeTax).toBeCloseTo(13498.9632, 6)
    expect(year.annualNet).toBeCloseTo(94008.9168, 6)
  })
  it("distinguishes a business with no revenue from an inactive business", () => {
    const input = constantIncomeYear(0, profile)
    expect(calculateB2BScenario(input).annualNet).toBeCloseTo(-27439.68, 6)
    const inactive = input.map((month) => ({ ...month, active: false }))
    expect(calculateB2BScenario(inactive).annualNet).toBe(0)
    expect(calculateUoPScenario(inactive).annualNet).toBe(0)
  })
  it("counts health only for active months without prorating annual revenue thresholds", () => {
    const input = constantIncomeYear(20000, profile).map((month, i) => i < 6 ? { ...month, gross: 0, active: false } : month)
    const year = calculateB2BScenario(input)
    expect(year.annualGross).toBe(120000)
    expect(year.socialZUS).toBeCloseTo(9898.92, 6)
    expect(year.healthContribution).toBeCloseTo(4983.48, 6)
  })
  it("resets annual accumulation on each independent year calculation", () => {
    const input = constantIncomeYear(30000, profile)
    expect(calculateUoPScenario(input)).toEqual(calculateUoPScenario(input))
  })
  it("requires an explicit full calendar year and rejects unsupported mixed rates", () => {
    expect(() => calculateUoPScenario(constantIncomeYear(5000, profile).slice(0, 6))).toThrow(/January through December/)
    const input = constantIncomeYear(5000, profile)
    input[1] = { gross: 5000, profile: { ...profile, b2b: { ...profile.b2b, ryczaltRate: 0.085 } } }
    expect(() => calculateB2BScenario(input)).toThrow(/one ryczalt rate/)
    expect(() => calculateB2BScenario(constantIncomeYear(1, profile).map((month) => ({ ...month, active: false })))).toThrow(/Inactive/)
  })
})
