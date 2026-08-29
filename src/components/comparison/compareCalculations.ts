import type { TaxProfile } from "../../config/tax"
import {
  calculateB2BFromGross,
  calculateB2BFromNet,
  calculateUoPFromGross,
  calculateUoPFromNet,
} from "../../lib/taxCalculations"
import { toPLN } from "../../lib/formatting"
import type { Currency, InputType } from "../../types"

export type ContractType = "B2B" | "UoP"

export interface Offer {
  id: string
  name: string
  amount: number
  currency: Currency
  contractType: ContractType
  inputType: InputType
}

export interface OfferCalculation extends Offer {
  grossPLN: number
  netPLN: number
  annualNetPLN: number
  hourlyGrossPLN: number
  hourlyNetPLN: number
}

export function calculateOffer(
  offer: Offer,
  profile: TaxProfile,
  rates: Record<string, number>,
  hoursPerMonth: number,
): OfferCalculation {
  const monthlyPLN = toPLN(offer.amount, offer.currency, rates)
  const result =
    offer.contractType === "B2B"
      ? offer.inputType === "gross"
        ? calculateB2BFromGross(monthlyPLN, profile)
        : calculateB2BFromNet(monthlyPLN, profile)
      : offer.inputType === "gross"
        ? calculateUoPFromGross(monthlyPLN, profile)
        : calculateUoPFromNet(monthlyPLN, profile)

  return {
    ...offer,
    grossPLN: result.monthlyGross,
    netPLN: result.monthlyNet,
    annualNetPLN: result.annualNet,
    hourlyGrossPLN: result.monthlyGross / hoursPerMonth,
    hourlyNetPLN: result.monthlyNet / hoursPerMonth,
  }
}

export function rankOffers(offers: OfferCalculation[]) {
  return [...offers].sort((left, right) => right.netPLN - left.netPLN)
}

export interface ComparisonSummary {
  winner: OfferCalculation
  runnerUp: OfferCalculation
  monthlyDeltaPLN: number
  annualDeltaPLN: number
  percentageDelta: number
}

export function summarizeOffers(
  offers: OfferCalculation[],
): ComparisonSummary | null {
  const [winner, runnerUp] = rankOffers(offers)
  if (!winner || !runnerUp) return null
  const monthlyDeltaPLN = Math.max(0, winner.netPLN - runnerUp.netPLN)
  return {
    winner,
    runnerUp,
    monthlyDeltaPLN,
    annualDeltaPLN: monthlyDeltaPLN * 12,
    percentageDelta:
      runnerUp.netPLN > 0 ? (monthlyDeltaPLN / runnerUp.netPLN) * 100 : 0,
  }
}
