export const NBP_TABLE_A_URL = "https://api.nbp.pl/api/exchangerates/tables/A/?format=json";
export const FRESH_CACHE_TTL_SECONDS = 12 * 60 * 60;
export const STALE_CACHE_TTL_SECONDS = 7 * 24 * 60 * 60;

export interface ExchangeRatesResponse {
  source: "NBP";
  effectiveDate: string;
  rates: {
    PLN_PLN: 1;
    USD_PLN: number;
    EUR_PLN: number;
  };
}

interface NbpRate {
  code?: unknown;
  effectiveDate?: unknown;
  mid?: unknown;
}

interface NbpTable {
  effectiveDate?: unknown;
  rates?: unknown;
}

export interface RateCache {
  match(request: Request): Promise<Response | undefined>;
  put(request: Request, response: Response): Promise<void>;
}

export type RateFetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export function parseNbpTable(data: unknown): ExchangeRatesResponse {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("NBP returned no table data");
  }

  const table = data[0] as NbpTable;
  if (typeof table.effectiveDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(table.effectiveDate)) {
    throw new Error("NBP returned an invalid effective date");
  }

  if (!Array.isArray(table.rates)) {
    throw new Error("NBP returned no rates");
  }

  const rates = new Map(
    table.rates.map((rate) => {
      const item = rate as NbpRate;
      return [item.code, item.mid] as const;
    }),
  );

  const usd = rates.get("USD");
  const eur = rates.get("EUR");
  if (!isPositiveRate(usd) || !isPositiveRate(eur)) {
    throw new Error("NBP returned invalid USD or EUR rates");
  }

  return {
    source: "NBP",
    effectiveDate: table.effectiveDate,
    rates: {
      PLN_PLN: 1,
      USD_PLN: usd,
      EUR_PLN: eur,
    },
  };
}

function isPositiveRate(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

export async function fetchCurrentRates(fetcher: RateFetcher = fetch): Promise<ExchangeRatesResponse> {
  const response = await fetcher(NBP_TABLE_A_URL, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`NBP request failed with status ${response.status}`);
  }

  return parseNbpTable(await response.json());
}

function jsonResponse(data: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...extraHeaders,
    },
  });
}

function withCacheStatus(response: Response, cacheStatus: "fresh" | "stale"): Response {
  const headers = new Headers(response.headers);
  headers.set("X-Rate-Cache", cacheStatus);
  return new Response(response.body, { status: response.status, headers });
}

export async function getExchangeRatesResponse(
  request: Request,
  cache: RateCache,
  fetcher: RateFetcher = fetch,
): Promise<Response> {
  if (request.method !== "GET") {
    return jsonResponse({ error: "Method not allowed" }, 405, { Allow: "GET" });
  }

  const cacheUrl = new URL("/api/exchange-rates", request.url);
  const freshKey = new Request(cacheUrl);
  const staleKey = new Request(`${cacheUrl.toString()}?cache=stale`);

  const fresh = await cache.match(freshKey);
  if (fresh) {
    return withCacheStatus(fresh, "fresh");
  }

  try {
    const data = await fetchCurrentRates(fetcher);
    const freshResponse = jsonResponse(data, 200, {
      "Cache-Control": `public, max-age=${FRESH_CACHE_TTL_SECONDS}, stale-if-error=${STALE_CACHE_TTL_SECONDS}`,
    });
    const staleResponse = jsonResponse(data, 200, {
      "Cache-Control": `public, max-age=${STALE_CACHE_TTL_SECONDS}`,
    });

    await cache.put(freshKey, freshResponse.clone());
    await cache.put(staleKey, staleResponse.clone());
    return withCacheStatus(freshResponse, "fresh");
  } catch (error) {
    const stale = await cache.match(staleKey);
    if (stale) {
      return withCacheStatus(stale, "stale");
    }

    return jsonResponse({ error: "Exchange rates are temporarily unavailable" }, 503, {
      "Cache-Control": "no-store",
    });
  }
}
