# Approxmate

A lightweight salary calculator for comparing employment contracts in Poland. One number in → all equivalents out.

**[🌐 Live Demo](https://approxmate.me/)** · **[📊 Tax Rules](./TAX_RULES_POLAND.md)** · **[📈 v1.1 Changelog](./V1.1_IMPLEMENTATION_SUMMARY.md)** · **[📚 Project docs](./docs/GA_EVENTS.md)**

---

## What It Does

Enter a salary (gross or net) → instantly see:
- Net/gross equivalents across 3 currencies (PLN, USD, EUR)
- B2B vs UoP comparison
- Hourly rates
- Pre-formatted recruiter message

Customize tax assumptions without leaving the interface.

## Quick Start

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5173/`.

For a production-like local Worker, build the app and run Wrangler instead:

```bash
pnpm cf:dev
```

Open `http://localhost:8787/`. The Vite dev server uses the built-in emergency rates; the Wrangler server exercises `/api/exchange-rates` and the static-asset SPA fallback.

## Project Structure

```
src/                         # React application
├── App.tsx                  # Main UI and application state
├── components/              # Reusable UI and modal components
├── lib/                     # Calculations, persistence, analytics, i18n
└── config/tax/2026.ts       # Polish tax rules (versioned by year)
worker/                      # Cloudflare Worker entrypoint and API logic
├── index.ts                 # SPA assets, redirects, and API routing
└── exchangeRates.ts         # NBP fetch, cache, and fallback handling
public/                      # Static files copied into the Vite build
docs/                        # Supporting project references
wrangler.jsonc               # Worker, assets, and local-dev configuration
```

`worker-configuration.d.ts` is generated from the Wrangler configuration; refresh it with `pnpm cf:types` after changing Worker bindings.

## Tax Calculation Logic

**Annual-first model** for accuracy:
- Gross monthly → × 12 → annual
- Apply annual thresholds (ZUS caps, PIT brackets)
- ÷ 12 → display average monthly net

Supports:
- **B2B** — Configurable ryczałt (8.5%-17%), ZUS profiles, auto health tiers
- **UoP** — Tax brackets (12%/32%), KUP deduction, PPK, annual caps

[📄 Full tax rules documentation](./TAX_RULES_POLAND.md)

## Tax Configuration

All Polish tax rules live in **`src/config/tax/2026.ts`**:
- Official ZUS contribution values
- Health thresholds
- Tax brackets & caps
- Source references included

Update this file when legislation changes.

## Features

- ✨ **Two modes** — Net or gross input
- 💱 **3 currencies** — PLN, USD, EUR
- ⚙️ **Customizable** — B2B rate, ZUS profile, PPK, KUP
- 📱 **Responsive** — Works on mobile
- 🌍 **Multilingual** — EN, PL, UA
- 💾 **Edge API** — Cloudflare Worker, localStorage only
- 📊 **Analytics** — Privacy-first GA4 tracking
- 🔄 **Exchange rates** — Auto-updated daily

## Customization

Click tax profile chips under the title to adjust:
- B2B ryczałt rate (8.5%-17%)
- ZUS profile (Full, Preferential, Ulga na start)
- Sickness insurance
- UoP KUP (250/300 PLN)
- PPK (2% employee)

Settings persist in browser storage.

## Tech Stack

- **React 19** + TypeScript
- **Vite** (fast builds)
- **Tailwind CSS v4** (styling)
- **Vitest** (automated unit tests)
- **GA4** (analytics, no PII)

No database is required; the exchange-rate API runs at the Cloudflare edge.

## Roadmap

### v1.1 ✅
- Configurable tax profiles
- Advanced B2B/UoP settings
- Annual-first calculations
- Automated regression coverage

### v1.2 (Planned)
- Salary history/comparison
- Lump-sum tax option
- Multiple employment scenarios

### v2.0 (Vision)
- **Multi-country support** — Extend tax config to other EU countries
- Germany, UK, Netherlands, etc.
- Unified calculator across markets

## Future: Multi-Country

Each country gets its own tax config file:
```
src/config/tax/
├── 2026.ts          # Poland
├── germany/2026.ts  # Germany (future)
├── uk/2026.ts       # UK (future)
└── index.ts         # Router
```

Same calculation engine, different tax rules.

## Exchange Rates

The Cloudflare Worker fetches USD and EUR from the NBP Table A endpoint in one request at `/api/exchange-rates`. Successful responses are cached for 12 hours, with a separately cached copy available for up to 7 days when NBP is unavailable. The frontend displays the NBP effective date and falls back to the built-in emergency rates only when the API has no cached response.

## Browser Support

Modern browsers: Chrome, Firefox, Safari, Edge. Requires ES2020+.

## Deployment

Cloudflare Workers serves both the Vite static assets and the exchange-rate API. Production deploys are configured for Cloudflare Workers Builds from `main`, with branch previews enabled in the Cloudflare dashboard.

```bash
pnpm build
pnpm deploy
```

The target production custom domain is `https://approxmate.me`; after the domain is moved to Cloudflare, `www.approxmate.me` will redirect to the canonical hostname.

## Testing

```bash
pnpm test:run            # Run the test suite once
pnpm type-check         # TypeScript validation
pnpm build              # Production asset build
pnpm cf:dry-run         # Build and validate the Worker deployment
```

## Privacy

- ✅ No user data stored on servers
- ✅ No salary amounts in analytics
- ✅ GA4 with IP anonymization
- ✅ Salary calculations run locally in the browser

## License

MIT

---

**Questions?** Open an issue or email `si13n@yahoo.com`
