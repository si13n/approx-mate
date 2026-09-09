import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { DEFAULT_TAX_PROFILE } from "../../config/tax"
import { translations } from "../../i18n/translations"
import { fmt } from "../../lib/formatting"
import {
  calculateB2BFromGross,
  calculateB2BFromNet,
  calculateUoPFromGross,
  calculateUoPFromNet,
} from "../../lib/taxCalculations"
import { getMonthlyBreakdown, MoneyBreakdown } from "./MoneyBreakdown"

describe("Monthly money breakdown", () => {
  it.each([
    calculateB2BFromGross,
    calculateB2BFromNet,
    calculateUoPFromGross,
    calculateUoPFromNet,
  ])("accounts for the full salary in %s", (calculate) => {
    for (const amount of [5000, 20000, 100000]) {
      const result = calculate(amount, DEFAULT_TAX_PROFILE)
      const breakdown = getMonthlyBreakdown(result)
      expect(breakdown.shares.reduce((sum, item) => sum + item.amount, 0))
        .toBeCloseTo(result.monthlyGross, 2)
      expect(breakdown.shares.reduce((sum, item) => sum + item.percentage, 0))
        .toBeCloseTo(100, 8)
      expect(breakdown.net).toBe(result.monthlyNet)
      expect(breakdown.shortfall).toBe(0)
    }
  })

  it("updates the chart when income, ryczałt and ZUS change", () => {
    const initial = getMonthlyBreakdown(calculateB2BFromGross(10000, DEFAULT_TAX_PROFILE))
    const higherIncome = getMonthlyBreakdown(calculateB2BFromGross(20000, DEFAULT_TAX_PROFILE))
    const updatedProfile = getMonthlyBreakdown(calculateB2BFromGross(10000, {
      ...DEFAULT_TAX_PROFILE,
      b2b: { ...DEFAULT_TAX_PROFILE.b2b, zusProfile: "ulgaNaStart", ryczaltRate: 0.085 },
    }))
    expect(higherIncome.shares[0].percentage).toBeGreaterThan(initial.shares[0].percentage)
    expect(updatedProfile.social).toBe(0)
    expect(updatedProfile.tax).toBeLessThan(initial.tax)
    expect(updatedProfile.shares[0].percentage).toBeGreaterThan(initial.shares[0].percentage)
  })

  it("includes employee PPK exactly once in deductions and details", () => {
    const result = calculateUoPFromGross(20000, {
      ...DEFAULT_TAX_PROFILE,
      uop: { ...DEFAULT_TAX_PROFILE.uop, ppkEnabled: true },
    })
    const breakdown = getMonthlyBreakdown(result)
    expect(breakdown.ppk).toBe(400)
    expect(breakdown.net + breakdown.tax + breakdown.social + breakdown.health + breakdown.ppk)
      .toBeCloseTo(20000, 2)
    const html = renderToStaticMarkup(<MoneyBreakdown calculation={result} contract="UoP" t={translations.en} />)
    expect(html).toContain(translations.en.ppk)
    expect(html).toContain(fmt(400, "PLN", 2))
  })

  it("shows zero shares for an empty input instead of fixed B2B costs", () => {
    const result = calculateB2BFromGross(0, DEFAULT_TAX_PROFILE)
    const breakdown = getMonthlyBreakdown(result)
    expect(breakdown.shares.every((item) => item.amount === 0 && item.percentage === 0)).toBe(true)
    expect(breakdown.social + breakdown.health + breakdown.tax).toBe(0)
    const html = renderToStaticMarkup(<MoneyBreakdown calculation={result} contract="B2B" t={translations.en} />)
    expect(html).not.toContain("linear-gradient")
    expect(html).not.toMatch(/NaN|Infinity/)
  })

  it("discloses a shortfall when fixed B2B contributions exceed gross", () => {
    const result = calculateB2BFromGross(100, DEFAULT_TAX_PROFILE)
    const breakdown = getMonthlyBreakdown(result)
    expect(breakdown.shortfall).toBeCloseTo(result.socialZUS + result.labourFund + result.healthContribution - 100, 2)
    const html = renderToStaticMarkup(<MoneyBreakdown calculation={result} contract="B2B" t={translations.en} />)
    expect(html).toContain(translations.en.contributionShortfall)
    expect(html).not.toContain("linear-gradient")
  })

  it.each(["en", "pl", "ua"] as const)("renders calculated amounts and a disclosure in %s", (lang) => {
    const result = calculateB2BFromNet(10000, DEFAULT_TAX_PROFILE)
    const t = translations[lang]
    const html = renderToStaticMarkup(<MoneyBreakdown calculation={result} contract="B2B" t={t} />)
    expect(html).toContain("<details")
    expect(html).toContain(t.seeCalculation)
    expect(html).toContain(fmt(result.incomeTax, "PLN", 2))
    expect(html).toContain(fmt(result.socialZUS, "PLN", 2))
    expect(html).toContain(fmt(result.healthContribution, "PLN", 2))
    expect(html).toContain(`${(result.monthlyNet / result.monthlyGross * 100).toFixed(1)}%`)
  })
})
