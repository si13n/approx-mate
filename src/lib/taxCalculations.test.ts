import { describe, expect, it } from "vitest"
import { DEFAULT_TAX_PROFILE, getTaxRules, type B2BZUSProfile, type TaxProfile, type UoPKUPType } from "../config/tax"
import { calculateB2BFromGross, calculateB2BFromNet, calculateUoPFromGross, calculateUoPFromNet } from "./taxCalculations"
import { progressiveTax } from "./tax/core"
import fixtures from "./tax/fixtures/2026.json"

// Fixed independent Decimal worksheet. Never derive expected values from the
// production rules/functions. Source references and workings are in docs.
describe("2026 independent reference estimates", () => {
  it.each(fixtures)("$contract gross $gross, KUP $kup, PPK $ppk, ZUS $zus, sickness $sickness", (row) => {
    const profile: TaxProfile = {
      b2b: { zusProfile: (row.zus ?? "full") as B2BZUSProfile, sicknesInsurance: row.sickness ?? false, ryczaltRate: row.rate ?? 0.12 },
      uop: { kupType: (row.kup ?? "standard") as UoPKUPType, ppkEnabled: row.ppk ?? false },
    }
    const result = row.contract === "UoP" ? calculateUoPFromGross(row.gross, profile) : calculateB2BFromGross(row.gross, profile)
    expect("socialZUS" in result ? result.socialZUS : result.socialContributions).toBeCloseTo(row.social, 6)
    expect(result.healthContribution).toBeCloseTo(row.health, 6)
    expect(result.incomeTax).toBeCloseTo(row.pit, 6)
    expect(result.monthlyNet).toBeCloseTo(row.net, 6)
    if ("labourFund" in result) expect(result.labourFund).toBeCloseTo(row.labourFund!, 6)
  })

  it.each([[0, 0], [30000, 0], [30001, 0.12], [50244, 2429.28], [120000, 10800], [120001, 10800.32], [240000, 49200]])(
    "PIT base %i gives %f (including threshold boundaries)", (base, expected) => {
      expect(progressiveTax(base, getTaxRules().uop.taxBrackets, 3600)).toBeCloseTo(expected, 6)
    },
  )

  it("includes employee PPK and tax on the employer's contribution, but no extra social/health", () => {
    const without = calculateUoPFromGross(5000, DEFAULT_TAX_PROFILE)
    const withPpk = calculateUoPFromGross(5000, { ...DEFAULT_TAX_PROFILE, uop: { kupType: "standard", ppkEnabled: true } })
    expect(withPpk.ppkContribution).toBe(100)
    expect(withPpk.employerPpkContribution).toBe(75)
    expect(without.monthlyNet - withPpk.monthlyNet).toBeCloseTo(109, 6)
    expect(withPpk.socialContributions).toBe(without.socialContributions)
    expect(withPpk.healthContribution).toBe(without.healthContribution)
  })

  it("applies the low-pay health cap based on 2021 PIT rules", () => {
    const result = calculateUoPFromGross(1000, DEFAULT_TAX_PROFILE)
    // (1000 - 137.10 - 250) rounds to 613; 613 * 17% - 43.76 = 60.45.
    expect(result.healthContribution).toBeCloseTo(60.45, 6)
    expect(result.monthlyNet).toBeCloseTo(802.45, 6)
    expect(result.incomeTax).toBe(0)
  })
})

describe("B2B health thresholds and fixed payments", () => {
  it.each([
    [6649.81, 498.35], [6649.82, 498.35], [6649.83, 830.58],
    [26649.81, 830.58], [26649.82, 830.58], [26649.83, 1495.04],
  ])("gross %f uses health provision %f", (gross, expected) => {
    expect(calculateB2BFromGross(gross, DEFAULT_TAX_PROFILE).healthContribution).toBeCloseTo(expected, 6)
  })
  it("keeps FP/FS out of both deductible social contributions and health thresholds", () => {
    const result = calculateB2BFromGross(6700, DEFAULT_TAX_PROFILE)
    expect(result.socialZUS).toBeCloseTo(1649.82, 6)
    expect(result.labourFund).toBeCloseTo(138.47, 6)
    expect(result.healthContribution).toBeCloseTo(830.58, 6)
  })
  it("displays zero available net when an invoice cannot cover fixed payments", () => {
    const result = calculateB2BFromGross(100, DEFAULT_TAX_PROFILE)
    expect(result.monthlyNet).toBe(0)
    expect(result.socialZUS + result.labourFund + result.healthContribution).toBeGreaterThan(100)
  })
})

describe("Inverse calculation", () => {
  for (const [name, inverse, forward] of [
    ["B2B", calculateB2BFromNet, calculateB2BFromGross],
    ["UoP", calculateUoPFromNet, calculateUoPFromGross],
  ] as const) {
    it.each([0, 1, 100, 500, 3500, 5000, 12000, 22000, 100000, 1000000])(`${name}: reaches %f PLN net`, (target) => {
      const result = inverse(target, DEFAULT_TAX_PROFILE)
      const actual = forward(result.monthlyGross, DEFAULT_TAX_PROFILE).monthlyNet
      expect(actual).toBeGreaterThanOrEqual(target)
      expect(actual - target).toBeLessThanOrEqual(0.01)
    })
  }
  it("chooses the earlier solution when two B2B gross values reach the same net", () => {
    // Independently: 3700 = 0.88*g - 1649.82*0.88 - 138.47 - 498.35*0.94.
    const result = calculateB2BFromNet(3700, DEFAULT_TAX_PROFILE)
    expect(result.monthlyGross).toBeCloseTo(6544.046136363636, 5)
    expect(result.monthlyGross).toBeLessThan(6649.82)
  })
  it("handles a target immediately around a health-tier drop", () => {
    const atThreshold = calculateB2BFromGross(6649.82, DEFAULT_TAX_PROFILE).monthlyNet
    const below = calculateB2BFromNet(atThreshold - 0.001, DEFAULT_TAX_PROFILE)
    const above = calculateB2BFromNet(atThreshold + 0.001, DEFAULT_TAX_PROFILE)
    expect(below.monthlyGross).toBeLessThan(6649.82)
    expect(above.monthlyGross).toBeGreaterThan(6649.82)
    expect(above.monthlyNet).toBeGreaterThanOrEqual(atThreshold + 0.001)
  })
  it("fails explicitly when the requested iteration limit cannot achieve accuracy", () => {
    expect(() => calculateUoPFromNet(5000, DEFAULT_TAX_PROFILE, 1)).toThrow(/one grosz/)
  })
})

describe("Input and year boundaries", () => {
  it.each([NaN, Infinity, -Infinity, -1])("rejects invalid amount %s", (amount) => {
    for (const calculate of [calculateB2BFromGross, calculateUoPFromGross, calculateB2BFromNet, calculateUoPFromNet]) {
      expect(() => calculate(amount, DEFAULT_TAX_PROFILE)).toThrow(RangeError)
    }
  })
  it("does not silently reuse current rules for an unsupported year", () => {
    expect(() => getTaxRules(2027)).toThrow(/Unsupported tax year/)
    expect(() => calculateUoPFromGross(5000, DEFAULT_TAX_PROFILE, 2027)).toThrow(/Unsupported tax year/)
    expect(calculateUoPFromGross(5000, DEFAULT_TAX_PROFILE, 2026).taxYear).toBe(2026)
  })
  it("does not mutate a shared saved profile", () => {
    const profile = Object.freeze({ b2b: Object.freeze({ ...DEFAULT_TAX_PROFILE.b2b }), uop: Object.freeze({ ...DEFAULT_TAX_PROFILE.uop }) })
    expect(() => calculateB2BFromGross(5000, profile)).not.toThrow()
    expect(() => calculateUoPFromGross(5000, profile)).not.toThrow()
  })
})
