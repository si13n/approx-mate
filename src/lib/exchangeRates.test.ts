import { describe, expect, it } from "vitest";
import { FALLBACK_RATES, fetchExchangeRatesOrFallback, formatRateDate, parseExchangeRates } from "./exchangeRates";

describe("frontend exchange-rate handling", () => {
  it("accepts a valid Worker response", () => {
    expect(parseExchangeRates({
      source: "NBP",
      effectiveDate: "2026-08-28",
      rates: { PLN_PLN: 1, USD_PLN: 3.7151, EUR_PLN: 4.3274 },
    }).rates.USD_PLN).toBe(3.7151);
  });

  it("rejects malformed API data so callers can use the fallback", () => {
    expect(() => parseExchangeRates({
      source: "NBP",
      effectiveDate: "2026-08-28",
      rates: { PLN_PLN: 1, USD_PLN: 0, EUR_PLN: 4.3274 },
    })).toThrow();
    expect(FALLBACK_RATES.rates).toEqual({ PLN_PLN: 1, USD_PLN: 3.85, EUR_PLN: 4.25 });
  });

  it("uses emergency rates when the Worker API is unavailable", async () => {
    const rates = await fetchExchangeRatesOrFallback(async () => new Response("unavailable", { status: 503 }));
    expect(rates).toBe(FALLBACK_RATES);
  });

  it("formats the NBP effective date instead of using the browser date", () => {
    expect(formatRateDate("2026-08-28")).toBe("Aug 28, 2026");
  });
});
