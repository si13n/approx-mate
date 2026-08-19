# Approxmate - Salary Calculator for Poland

A modern, lightweight salary calculator for comparing B2B and UoP contracts in Poland. Instantly see take-home pay, tax equivalents, and hourly rates across different currencies.

## Features

- **Two Calculator Modes**
  - "They offer me" - Enter an offer and see all equivalent contract types
  - "I want to earn" - Enter desired take-home and see what to ask for

- **Multi-Currency Support** - PLN, USD, EUR with automatic conversion

- **Contract Types** - B2B (ryczałt 12%) and UoP (skala podatkowa)

- **Multiple Results** - Net/gross amounts, hourly rates, effective tax rates

- **Message for Recruiter** - Auto-generated, recruiter-friendly message with one-click copy

- **Quick Scenarios** - Pre-configured salary ranges for quick exploration

- **Multi-Language** - English, Polish, Ukrainian

- **Automatic Exchange Rates** - GitHub Actions keeps rates updated daily from NBP API

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- No backend required

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Opens on `http://localhost:8443` (or configured port).

### Build

```bash
pnpm build
```

### Preview

```bash
pnpm preview
```

## Configuration

### Tax Rules

Polish tax configuration for 2026 is in `src/config/tax.config.ts`. Update this file when tax rules change:

- UoP tax brackets and ZUS rates
- B2B ryczałt rate and health insurance thresholds
- Tax-free amounts (KUP)

### Exchange Rates

Exchange rates are stored in `public/exchange-rates.json`. 

**For V1:** Manually update this file with current rates.

**Exchange Rate Updates:**
A GitHub Actions workflow (`.github/workflows/update-exchange-rates.yml`) fetches rates daily from [NBP API](https://api.nbp.pl) and commits updates automatically.

## Project Structure

```
├── src/
│   ├── App.tsx              # Main calculator component
│   ├── index.css            # Global styles + Tailwind config
│   ├── main.tsx             # React entry point
│   ├── config/
│   │   └── tax.config.ts    # Polish tax rules configuration
│   └── lib/
│       └── calculations.ts  # Tax calculation engine
├── public/
│   └── exchange-rates.json  # Current exchange rates
├── .github/
│   └── workflows/
│       └── update-exchange-rates.yml  # Daily rate update action
└── index.html               # HTML shell
```

## Calculations

All calculations follow Polish tax law as of 2026:

### UoP (Employment Contract)
- Employee ZUS contribution: 13.71%
- Health insurance (Zdrowotna): 9% of (Brutto - ZUS)
- Tax-free amount (KUP): PLN 250
- Income tax brackets: 12% up to PLN 10k, 32% above

### B2B (Self-Employment with Ryczałt)
- Flat ryczałt tax: 12% of gross
- Health insurance varies by annual income:
  - ≤ PLN 60k/year: PLN 463/month
  - ≤ PLN 300k/year: PLN 772/month
  - > PLN 300k/year: PLN 1,389/month

Results are **approximate estimates**, not official tax advice.

## Multi-Language

Strings are defined in `src/App.tsx` in the `T` object. Add new languages by:

1. Adding a language code (e.g., `de`)
2. Adding translations to the `T` object
3. Adding the language to the language selector buttons

## Deployment

This is a static site with no backend. Deploy to any static host:
- Vercel
- Netlify
- GitHub Pages
- Any CDN (S3, Cloudflare Pages, etc.)

The app loads exchange rates from `public/exchange-rates.json` at startup.

## Exchange Rate Updates

The app loads exchange rates from `public/exchange-rates.json` when it initializes. If loading fails, it falls back to hardcoded defaults.

**Manual Update:**
Edit `public/exchange-rates.json`:

```json
{
  "timestamp": "2026-08-19T00:00:00Z",
  "source": "manual",
  "rates": {
    "PLN_PLN": 1.0,
    "USD_PLN": 3.85,
    "EUR_PLN": 4.25
  }
}
```

**Automatic Updates (GitHub Actions):**
The workflow runs daily at 8 AM UTC and fetches rates from NBP API. Requires:
- Repository with GitHub Actions enabled
- Workflow has write access to commit to main branch

To trigger manually: Go to Actions → Update Exchange Rates → Run workflow.

## Browser Support

Modern browsers (Chrome, Firefox, Safari, Edge). Requires ES2020+ support.

## License

MIT

## Contributing

Feedback and suggestions welcome at `feedback@approxmate.app`
