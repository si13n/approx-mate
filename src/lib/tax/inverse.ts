import { assertAmount } from "./core"

/** Search only within an interval without a health-tier discontinuity. */
export function solveGross<T extends { monthlyNet: number }>(
  target: number,
  calculate: (gross: number) => T,
  minimum = 0,
  maximum = Infinity,
  maxIterations = 64,
): T | null {
  assertAmount(target)
  if (!Number.isInteger(maxIterations) || maxIterations < 1) throw new RangeError("Invalid iteration limit")
  let lo = minimum
  if (calculate(lo).monthlyNet >= target) return calculate(lo)
  let hi = Number.isFinite(maximum) ? maximum : Math.max(1000, target, minimum * 2)
  while (calculate(hi).monthlyNet < target) {
    if (Number.isFinite(maximum)) return null
    hi *= 2
    assertAmount(hi)
  }
  for (let i = 0; i < maxIterations; i++) {
    const mid = lo + (hi - lo) / 2
    if (calculate(mid).monthlyNet < target) lo = mid
    else hi = mid
  }
  const result = calculate(hi)
  // Return the feasible upper bound, never the midpoint below the goal.
  if (result.monthlyNet < target || result.monthlyNet - target > 0.01) {
    throw new RangeError("Could not resolve the target net within one grosz")
  }
  return result
}
