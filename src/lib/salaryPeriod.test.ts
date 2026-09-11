import { describe, expect, it } from "vitest"
import {
  convertSalaryPeriod,
  fromMonthlyAmount,
  toMonthlyAmount,
} from "./salaryPeriod"

describe("salary period conversion", () => {
  it("normalizes yearly and hourly inputs to a monthly amount", () => {
    expect(toMonthlyAmount(60_000, "year")).toBe(5_000)
    expect(toMonthlyAmount(31.25, "hour")).toBe(5_000)
  })

  it("converts a monthly amount for display", () => {
    expect(fromMonthlyAmount(5_000, "year")).toBe(60_000)
    expect(fromMonthlyAmount(5_000, "hour")).toBe(31.25)
  })

  it("keeps the same monthly value when the selected period changes", () => {
    const yearly = convertSalaryPeriod(5_000, "month", "year")
    expect(toMonthlyAmount(yearly, "year")).toBe(5_000)
  })
})
