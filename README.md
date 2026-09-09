# ApproxMate

**ApproxMate is a modular job, compensation, fit, and career decision platform.**

Today it provides a fast Poland-focused compensation calculator for comparing B2B and UoP offers. The product roadmap expands that foundation into job analysis, explainable offer scoring, CV fit, negotiation support, job comparison, saved decision history, market benchmarking, and an adaptive Career Copilot.

**[Open ApproxMate](https://approxmate.me)** · **[Product Roadmap](https://github.com/si13n/approx-mate/issues/15)** · **[Product PRD](https://github.com/si13n/approx-mate/issues/12)**

---

## What It Does Today

Enter a salary in gross or net terms and instantly see:

- Net/gross equivalents across PLN, USD, and EUR
- B2B vs UoP comparison
- Monthly, annual, and hourly values
- Configurable Polish tax assumptions
- Pre-formatted recruiter message
- Dated NBP exchange-rate information
- Deterministic Job X-Ray for vacancy URLs or pasted text (no AI/API key)
- Up to three analyzed-offer tabs with a comparison handoff

The current experience is intentionally low-friction: salary calculations run locally, tax settings persist in the browser, and no account is required.

## Product Direction

ApproxMate is evolving from a compensation calculator into a set of independent but connected decision modules. Users should be able to start from the calculator, a vacancy, a CV/profile, or a comparison and progressively add context only when it improves the answer.

The planned sequence is maintained in **[Product Roadmap #15](https://github.com/si13n/approx-mate/issues/15)**:

1. UX Polish
2. Job X-Ray + Offer Score
3. Shareable Result Card
4. CV Match + Personalized Verdict
5. Negotiation Advisor + Recruiter Reply
6. Job Comparison
7. Authorization + Saved Jobs / History
8. Market Benchmarking
9. Career Copilot

The detailed modular product model, entry points, artifacts, adaptive flows, and capability boundaries live in **[Product PRD #12](https://github.com/si13n/approx-mate/issues/12)**.

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

```text
src/                         # React application
├── App.tsx                  # Main UI and application state
├── components/              # Reusable UI and modal components
├── lib/taxCalculations.ts   # Shared calculator API
├── lib/tax/                 # Pure tax functions, monthly scenarios, inverse solver
└── config/tax/              # Typed rules registry and sources by year
worker/                      # Cloudflare Worker entrypoint and API logic
├── index.ts                 # SPA assets, redirects, and API routing
└── exchangeRates.ts         # NBP fetch, cache, and fallback handling
public/                      # Static files copied into the Vite build
docs/                        # Supporting project documentation
wrangler.jsonc               # Worker, assets, and local-dev configuration
```

`worker-configuration.d.ts` is generated from the Wrangler configuration; refresh it with `pnpm cf:types` after changing Worker bindings.

## Current Features

- **Two calculation modes** — net or gross input
- **Three currencies** — PLN, USD, EUR
- **B2B / UoP comparison** — normalized compensation view
- **Custom tax profile** — B2B rate, ZUS profile, PPK, KUP, sickness insurance
- **Responsive UI** — desktop and mobile layouts
- **Multilingual UI** — EN, PL, UA
- **Cloudflare edge API** — exchange-rate endpoint and static app delivery
- **Privacy-first analytics** — no salary values sent to analytics
- **Automatic exchange rates** — dated NBP rates with cache/fallback handling

## Tax Calculation Logic

ApproxMate uses an **annual-average estimate**, not a monthly payslip:

- Expand constant income into twelve months, or supply a monthly scenario
- Apply monthly contributions and annual caps, then calculate annual PIT
- Convert the annual estimate back to an average monthly value
- Keep B2B social insurance and non-deductible FP/FS separate
- Verify reverse calculations within each B2B health tier

Supported Polish contract logic includes:

- **B2B** — configurable ryczałt rates, ZUS profiles, and health contribution tiers
- **UoP** — PIT brackets, KUP deduction, PPK, and annual contribution caps

See **[Polish tax rules](./docs/TAX_RULES_POLAND.md)** for the detailed calculation assumptions and source references.

## Tax Configuration

Polish tax rules are registered by year in `src/config/tax/index.ts`. The currently supported ruleset is `src/config/tax/2026.ts`, including:

- ZUS contribution values
- Health thresholds
- Tax brackets and caps
- Effective dates, verification date and specific official source references

Update the configuration when legislation changes rather than scattering tax constants through application code.

## Exchange Rates

The Cloudflare Worker fetches USD and EUR rates from the NBP Table A endpoint through `/api/exchange-rates`.

Successful responses are cached for 12 hours, with a separately cached copy available for up to 7 days when NBP is unavailable. The frontend displays the NBP effective date and uses built-in emergency rates only when the API has no usable cached response.

## Tech Stack

- **React 19** + TypeScript
- **Vite**
- **Tailwind CSS v4**
- **Vitest**
- **Cloudflare Workers**
- **GA4** with privacy-safe event tracking

The current product does not require a database. Persistent accounts and saved cloud history are planned separately in roadmap issue **[#22](https://github.com/si13n/approx-mate/issues/22)**.

## Documentation

- **[Product Roadmap](https://github.com/si13n/approx-mate/issues/15)** — high-level product delivery sequence
- **[Modular Product PRD](https://github.com/si13n/approx-mate/issues/12)** — core modules, artifacts, entry points, and adaptive funnels
- **[Polish Tax Rules](./docs/TAX_RULES_POLAND.md)** — tax calculation assumptions and references
- **[GA4 Events](./docs/GA_EVENTS.md)** — analytics event definitions
- **[UX Redesign](https://github.com/si13n/approx-mate/issues/9)** — current redesign work
- **[Competitor Landscape](https://github.com/si13n/approx-mate/issues/10)** — product/market comparison

## Deployment

Cloudflare Workers serves both the Vite static assets and the exchange-rate API. Production deployments are configured from `main`, with branch previews available through Cloudflare.

```bash
pnpm build
pnpm deploy
```

Production: **https://approxmate.me**

## Testing

```bash
pnpm test:run            # Run the test suite once
pnpm type-check          # TypeScript validation
pnpm build               # Production asset build
pnpm cf:dry-run          # Build and validate the Worker deployment
```

## Browser Support

Modern Chrome, Firefox, Safari, and Edge. Requires ES2020+.

## Privacy

Current calculator behavior:

- No salary amounts are stored on the server
- No salary amounts are sent to analytics
- Salary calculations run locally in the browser
- Tax-profile settings persist in browser storage

Future CV, account, and saved-history capabilities must define explicit consent, retention, export, and deletion behavior before implementation.

## License

MIT

---

**Questions or ideas?** Open a GitHub issue.
