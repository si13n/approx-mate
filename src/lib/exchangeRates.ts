import { useEffect, useState } from "react";
import { DEFAULT_EXCHANGE_RATES } from "../config/exchangeRates";

export interface ExchangeRatesResponse {
  source: "NBP";
  effectiveDate: string;
  rates: {
    PLN_PLN: 1;
    USD_PLN: number;
    EUR_PLN: number;
  };
}

export const FALLBACK_RATES: ExchangeRatesResponse = {
  source: "NBP",
  effectiveDate: "",
  rates: DEFAULT_EXCHANGE_RATES,
};

export function parseExchangeRates(data: unknown): ExchangeRatesResponse {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid exchange-rate response");
  }

  const value = data as Partial<ExchangeRatesResponse>;
  const rates = value.rates;
  if (
    value.source !== "NBP" ||
    typeof value.effectiveDate !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value.effectiveDate) ||
    !rates ||
    rates.PLN_PLN !== 1 ||
    !isPositiveRate(rates.USD_PLN) ||
    !isPositiveRate(rates.EUR_PLN)
  ) {
    throw new Error("Invalid exchange-rate response");
  }

  return value as ExchangeRatesResponse;
}

function isPositiveRate(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

export async function fetchExchangeRates(fetcher: typeof fetch = fetch): Promise<ExchangeRatesResponse> {
  const response = await fetcher("/api/exchange-rates", {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Exchange-rate API failed with status ${response.status}`);
  }

  return parseExchangeRates(await response.json());
}

export async function fetchExchangeRatesOrFallback(fetcher: typeof fetch = fetch): Promise<ExchangeRatesResponse> {
  try {
    return await fetchExchangeRates(fetcher);
  } catch {
    return FALLBACK_RATES;
  }
}

export function formatRateDate(
  effectiveDate: string,
  locale = "en-US",
): string {
  if (!effectiveDate) return "built-in fallback";
  return new Date(`${effectiveDate}T00:00:00Z`).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function useExchangeRates() {
  const [state, setState] = useState({
    rates: FALLBACK_RATES.rates,
    effectiveDate: FALLBACK_RATES.effectiveDate,
    isFallback: true,
    isLoading: true,
  });

  useEffect(() => {
    let active = true;
    void fetchExchangeRatesOrFallback()
      .then((data) => {
        if (active) {
          setState({ rates: data.rates, effectiveDate: data.effectiveDate, isFallback: data === FALLBACK_RATES, isLoading: false });
        }
      })

    return () => {
      active = false;
    };
  }, []);

  return state;
}
