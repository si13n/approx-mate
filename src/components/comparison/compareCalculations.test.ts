import { describe, expect, it } from "vitest"
import { DEFAULT_TAX_PROFILE } from "../../config/tax"
import {
  calculateB2BFromGross,
  calculateB2BFromNet,
  calculateUoPFromGross,
  calculateUoPFromNet,
} from "../../lib/taxCalculations"
import {
  calculateOffer,
  rankOffers,
  summarizeOffers,
  type Offer,
} from "./compareCalculations"

const rates = { PLN_PLN: 1, USD_PLN: 4, EUR_PLN: 4.5 }

describe("calculateOffer", () => {
  it("uses the shared B2B engine for gross offers", () => {
    const offer: Offer = {
      id: "a",
      name: "A",
      amount: 25000,
      currency: "PLN",
      contractType: "B2B",
      inputType: "gross",
    }
    const result = calculateOffer(offer, DEFAULT_TAX_PROFILE, rates, 160)
    expect(result.netPLN).toBeCloseTo(
      calculateB2BFromGross(25000, DEFAULT_TAX_PROFILE).monthlyNet,
      6,
    )
    expect(result.hourlyGrossPLN).toBeCloseTo(156.25, 6)
  })

  it("uses the shared UoP engine for net offers", () => {
    const offer: Offer = {
      id: "b",
      name: "B",
      amount: 22000,
      currency: "PLN",
      contractType: "UoP",
      inputType: "net",
    }
    const result = calculateOffer(offer, DEFAULT_TAX_PROFILE, rates, 160)
    expect(result.grossPLN).toBeCloseTo(
      calculateUoPFromNet(22000, DEFAULT_TAX_PROFILE).monthlyGross,
      6,
    )
    expect(result.netPLN).toBeCloseTo(22000, 4)
  })

  it("uses the shared B2B engine for net offers", () => {
    const offer: Offer = {
      id: "c",
      name: "C",
      amount: 18000,
      currency: "PLN",
      contractType: "B2B",
      inputType: "net",
    }
    const result = calculateOffer(offer, DEFAULT_TAX_PROFILE, rates, 160)
    expect(result.grossPLN).toBeCloseTo(
      calculateB2BFromNet(18000, DEFAULT_TAX_PROFILE).monthlyGross,
      6,
    )
  })

  it("uses the shared UoP engine for gross offers", () => {
    const offer: Offer = {
      id: "d",
      name: "D",
      amount: 22000,
      currency: "PLN",
      contractType: "UoP",
      inputType: "gross",
    }
    const result = calculateOffer(offer, DEFAULT_TAX_PROFILE, rates, 160)
    expect(result.netPLN).toBeCloseTo(
      calculateUoPFromGross(22000, DEFAULT_TAX_PROFILE).monthlyNet,
      6,
    )
  })

  it.each(["PLN", "USD", "EUR"] as const)(
    "converts %s before tax calculation",
    (currency) => {
      const offer: Offer = {
        id: currency,
        name: currency,
        amount: 5000,
        currency,
        contractType: "B2B",
        inputType: "gross",
      }
      const result = calculateOffer(offer, DEFAULT_TAX_PROFILE, rates, 160)
      expect(result.grossPLN).toBe(5000 * rates[`${currency}_PLN`])
    },
  )
})

describe("rankOffers", () => {
  it("returns a descending copy without mutating its input", () => {
    const base = {
      amount: 1,
      currency: "PLN",
      contractType: "B2B",
      inputType: "gross",
      grossPLN: 1,
      annualNetPLN: 1,
      hourlyGrossPLN: 1,
      hourlyNetPLN: 1,
    } as const
    const input = [
      { ...base, id: "a", name: "A", netPLN: 10 },
      { ...base, id: "b", name: "B", netPLN: 20 },
    ]
    expect(rankOffers(input).map((item) => item.id)).toEqual(["b", "a"])
    expect(input.map((item) => item.id)).toEqual(["a", "b"])
  })

  it("derives winner and monthly, annual, and percentage deltas", () => {
    const base = {
      amount: 1,
      currency: "PLN",
      contractType: "B2B",
      inputType: "gross",
      grossPLN: 1,
      annualNetPLN: 1,
      hourlyGrossPLN: 1,
      hourlyNetPLN: 1,
    } as const
    const summary = summarizeOffers([
      { ...base, id: "a", name: "A", netPLN: 11000 },
      { ...base, id: "b", name: "B", netPLN: 10000 },
    ])

    expect(summary?.winner.id).toBe("a")
    expect(summary?.monthlyDeltaPLN).toBe(1000)
    expect(summary?.annualDeltaPLN).toBe(12000)
    expect(summary?.percentageDelta).toBe(10)
  })
})
