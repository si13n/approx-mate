import { describe, expect, it } from "vitest"
import {
  createAnalysisComparisonOffers,
  createCalculatorComparisonOffers,
} from "./comparisonPrefill"
import type { AnalyzedOffer, JobAnalysis } from "./types"

const target = {
  amount: 5_000,
  currency: "USD" as const,
  inputType: "net" as const,
}

function analysis(overrides: Partial<JobAnalysis> = {}): JobAnalysis {
  const field = <T>(value: T | null) => ({
    value,
    confidence: value === null ? null : "high" as const,
    method: value === null ? null : "pattern" as const,
    evidence: [],
  })

  return {
    id: "job-1",
    source: { kind: "text", url: null, capturedAt: "2026-09-03T00:00:00.000Z" },
    title: field("Backend Engineer"),
    company: field<string>(null),
    location: field<string>(null),
    workMode: field<"remote" | "hybrid" | "onsite">(null),
    officeDaysPerWeek: field<number>(null),
    contractTypes: field(["B2B"]),
    salary: field({
      min: 20_000,
      max: 25_000,
      currency: "PLN",
      period: "month",
      amountType: "invoice",
    }),
    seniority: field<string>(null),
    experience: field<string>(null),
    english: field<string>(null),
    requiredSkills: field<string[]>([]),
    responsibilities: field<string[]>([]),
    niceToHave: field<string[]>([]),
    benefits: field<string[]>([]),
    warnings: [],
    ...overrides,
  }
}

function analyzed(value: JobAnalysis): AnalyzedOffer {
  return { id: value.id, analysis: value, sourceText: "vacancy" }
}

describe("comparison prefills", () => {
  it("creates B2B and UoP calculator variants from the current target", () => {
    expect(createCalculatorComparisonOffers(target)).toEqual([
      { id: "1", name: "A", contractType: "B2B", ...target },
      { id: "2", name: "B", contractType: "UoP", ...target },
    ])
  })

  it("prefills a parsed monthly salary and adds the current target", () => {
    const result = createAnalysisComparisonOffers(
      [analyzed(analysis())],
      target,
    )

    expect(result[0]).toMatchObject({
      amount: 20_000,
      currency: "PLN",
      contractType: "B2B",
      inputType: "gross",
    })
    expect(result[1]).toMatchObject(target)
  })

  it("does not silently convert hourly or annual salary periods", () => {
    const job = analysis({
      salary: {
        value: {
          min: 100,
          max: 120,
          currency: "PLN",
          period: "hour",
          amountType: "net",
        },
        confidence: "high",
        method: "pattern",
        evidence: [],
      },
    })

    expect(
      createAnalysisComparisonOffers([analyzed(job)], target)[0],
    ).toMatchObject({
      amount: 0,
      currency: "PLN",
      inputType: "net",
    })
  })
})
