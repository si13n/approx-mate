# ApproxMate

Poland-focused salary calculator for comparing B2B and UoP compensation.

Production: [approxmate.me](https://approxmate.me)

## Current functionality

- Salary input as net or gross in PLN, USD, or EUR.
- Monthly, yearly, and hourly periods.
- B2B and UoP calculations using the supported 2026 ruleset.
- Editable tax profile: ryczałt rate, ZUS profile, KUP, and PPK.
- Live NBP exchange rates with cached and fallback values.
- Recruiter message generator.
- EN, PL, and UA interfaces.
- Tax profile saved locally in the browser.

The `/job-xray` screen is currently a placeholder. The Worker also exposes `/api/job-analysis`, but it is not connected to that screen yet. `/compare` is currently a placeholder page.

## Development

```bash
pnpm install
pnpm dev              # http://localhost:5173
pnpm cf:dev           # local Worker at http://localhost:8787
```

Checks:

```bash
pnpm test:run
pnpm type-check
pnpm build
```

Deploy to Cloudflare Workers with `pnpm deploy`.

## Tax model

Calculations are annual estimates divided by twelve, not payroll slips or tax advice. Only the 2026 ruleset is configured. See [Polish tax estimates](./docs/TAX_RULES_POLAND.md).

## Analytics

The currently tracked GA4 events are documented in [GA4 Events](./docs/GA_EVENTS.md). Entered salary amounts and calculated results are not sent to analytics; quick-scenario events contain the selected preset label.

## License

MIT
