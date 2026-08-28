import { describe, expect, it, vi } from "vitest";
import {
  getExchangeRatesResponse,
  parseNbpTable,
  type RateCache,
} from "./exchangeRates";

const validNbpTable = [
  {
    effectiveDate: "2026-08-28",
    rates: [
      { code: "USD", mid: 3.7151 },
      { code: "EUR", mid: 4.3274 },
    ],
  },
];

function createCache(): RateCache & { values: Map<string, Response> } {
  const values = new Map<string, Response>();
  return {
    values,
    match: vi.fn(async (request: Request) => values.get(request.url)?.clone()),
    put: vi.fn(async (request: Request, response: Response) => {
      values.set(request.url, response.clone());
    }),
  };
}

describe("NBP exchange rates", () => {
  it("returns validated USD, EUR, PLN rates from one NBP table", () => {
    expect(parseNbpTable(validNbpTable)).toEqual({
      source: "NBP",
      effectiveDate: "2026-08-28",
      rates: { PLN_PLN: 1, USD_PLN: 3.7151, EUR_PLN: 4.3274 },
    });
  });

  it.each([
    [{ effectiveDate: "2026-08-28", rates: [{ code: "USD", mid: 3.7 }] }],
    [{ effectiveDate: "2026-08-28", rates: [{ code: "USD", mid: 0 }, { code: "EUR", mid: 4.3 }] }],
    [{ effectiveDate: "2026-08-28", rates: [{ code: "USD", mid: "3.7" }, { code: "EUR", mid: 4.3 }] }],
  ])("rejects invalid NBP data", (table) => {
    expect(() => parseNbpTable([table])).toThrow();
  });

  it("serves the last cached response when NBP is unavailable", async () => {
    const cache = createCache();
    const firstResponse = await getExchangeRatesResponse(
      new Request("https://approxmate.me/api/exchange-rates"),
      cache,
      vi.fn(async () => new Response(JSON.stringify(validNbpTable), { status: 200 })),
    );
    expect(firstResponse.status).toBe(200);

    const staleRequest = new Request("https://approxmate.me/api/exchange-rates");
    const staleKey = `${new URL("/api/exchange-rates", staleRequest.url).toString()}?cache=stale`;
    const stale = cache.values.get(staleKey);
    expect(stale).toBeDefined();
    cache.values.delete(new URL("/api/exchange-rates", staleRequest.url).toString());

    const fallbackResponse = await getExchangeRatesResponse(
      staleRequest,
      cache,
      vi.fn(async () => new Response("NBP down", { status: 503 })),
    );
    expect(fallbackResponse.status).toBe(200);
    expect(fallbackResponse.headers.get("X-Rate-Cache")).toBe("stale");
    expect(await fallbackResponse.json()).toEqual(await stale!.json());
  });

  it("returns 503 when NBP fails and no cached response exists", async () => {
    const response = await getExchangeRatesResponse(
      new Request("https://approxmate.me/api/exchange-rates"),
      createCache(),
      vi.fn(async () => new Response("NBP down", { status: 503 })),
    );

    expect(response.status).toBe(503);
  });
});
