import { getExchangeRatesResponse } from "./exchangeRates";

type WorkerCacheStorage = CacheStorage & { readonly default: Cache };

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.hostname === "www.approxmate.me") {
      return Response.redirect(`https://approxmate.me${url.pathname}${url.search}`, 301);
    }

    if (url.pathname === "/api/exchange-rates") {
      return getExchangeRatesResponse(request, (caches as WorkerCacheStorage).default);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
