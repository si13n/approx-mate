import type { Offer } from "../../components/comparison/compareCalculations"
import type { Currency, InputType } from "../../types"
import type { AnalyzedOffer } from "./types"

interface CalculatorTarget {
  amount: number
  currency: Currency
  inputType: InputType
}

export function createCalculatorComparisonOffers(
  target: CalculatorTarget,
): Offer[] {
  return [
    { id: "1", name: "A", contractType: "B2B", ...target },
    { id: "2", name: "B", contractType: "UoP", ...target },
  ]
}

function createAnalyzedComparisonOffer(
  offer: AnalyzedOffer,
  index: number,
): Offer {
  const salary = offer.analysis.salary.value
  const contractTypes = offer.analysis.contractTypes.value ?? []
  const contractType = contractTypes.some((type) => /b2b/i.test(type))
    ? "B2B"
    : "UoP"
  const hasComparableSalary =
    salary?.period === "month" &&
    salary.min !== null &&
    salary.currency !== null

  return {
    id: String(index + 1),
    name: String.fromCharCode(65 + index),
    amount: hasComparableSalary ? (salary.min ?? 0) : 0,
    currency: hasComparableSalary ? (salary.currency ?? "PLN") : "PLN",
    contractType,
    inputType: salary?.amountType === "net" ? "net" : "gross",
  }
}

export function createAnalysisComparisonOffers(
  analyzedOffers: AnalyzedOffer[],
  target: CalculatorTarget,
): Offer[] {
  const offers = analyzedOffers
    .slice(0, 3)
    .map((offer, index) => createAnalyzedComparisonOffer(offer, index))

  if (offers.length < 2) {
    offers.push({
      id: String(offers.length + 1),
      name: String.fromCharCode(65 + offers.length),
      amount: target.amount,
      currency: target.currency,
      contractType: "B2B",
      inputType: target.inputType,
    })
  }

  return offers
}
