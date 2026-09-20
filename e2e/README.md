# ApproxMate Playwright tests

This directory uses a small, conventional Playwright structure that is easy to
grow without mixing selectors, reusable actions, and test intent.

```text
e2e/
├── fixtures/   # Creates page objects for each isolated test.
├── pages/      # Stores page selectors and reusable user actions.
└── tests/      # Describes the user behavior and API contracts we verify.
```

## Run the suite

```bash
pnpm test:e2e
```

The default configuration builds the app and starts the local Cloudflare Worker,
so both browser routes and `/api/*` routes are tested. Useful alternatives:

```bash
pnpm test:e2e:headed
pnpm test:e2e:ui
pnpm exec playwright show-report
```

Set `PLAYWRIGHT_BASE_URL` to test an already running environment instead of
starting the local server:

```bash
PLAYWRIGHT_BASE_URL=https://approxmate.me pnpm test:e2e
```

## Why this structure

- Tests state *what* the user does and expects.
- Page objects contain *how* Playwright finds and operates the UI.
- Fixtures create clean page-object instances for every test.
- Role and label locators follow the accessible UI and are less brittle than CSS.
- The API test checks a stable contract without depending on the live NBP service.
