import type { SalaryInputPeriod } from "../types"

export const HOURS_PER_MONTH = 160

export function toMonthlyAmount(amount: number, period: SalaryInputPeriod) {
  if (period === "hour") return amount * HOURS_PER_MONTH
  if (period === "year") return amount / 12
  return amount
}

export function fromMonthlyAmount(amount: number, period: SalaryInputPeriod) {
  if (period === "hour") return amount / HOURS_PER_MONTH
  if (period === "year") return amount * 12
  return amount
}

export function convertSalaryPeriod(
  amount: number,
  from: SalaryInputPeriod,
  to: SalaryInputPeriod,
) {
  return fromMonthlyAmount(toMonthlyAmount(amount, from), to)
}
