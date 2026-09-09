# Polish tax estimates

ApproxMate compares annual compensation and displays annual totals divided by 12. These are **average monthly estimates**, not the amount on a particular payslip or a tax-return calculation. Supported inputs were checked against the sources below on 9 September 2026.

## One engine and one ruleset per year

- `src/config/tax/<year>.ts`: rates, thresholds, contribution amounts, effective dates and source URLs.
- `src/config/tax/index.ts`: year registry and default profile. Unknown years fail explicitly; they never silently use another year's rules.
- `src/lib/tax/core.ts`: pure PIT, contribution and health functions with explicit rules as input.
- `src/lib/tax/scenarios.ts`: January–December scenarios with monthly income and profiles, annual accumulation and totals.
- `src/lib/tax/inverse.ts`: bounded net-to-gross search with a verified feasible result.
- `src/lib/taxCalculations.ts`: the shared public API for Calculator, Compare and money breakdowns.

The obsolete `calculations.ts` and `tax.config.ts` implementations have been removed. FX display fallbacks live separately in `src/config/exchangeRates.ts`; live NBP rates come from the Cloudflare API.

## Calculation assumptions

**UoP:** one employer, ordinary salary, standard or commuter KUP, full annual tax reduction, no other income or special exemptions. Pension and disability share an annual contribution-base cap. Sickness remains uncapped. Employee contributions reduce both health and PIT bases; employer accident insurance is never deducted from employee gross. Basic employee PPK reduces take-home; basic employer PPK increases taxable income, without increasing employee social/health bases. Employer PPK is assumed paid in the same year. The low-pay health cap uses the statutory 2021 reference with PIT-2 assumed.

Annual PIT applies each rate only to the base inside that bracket, then deducts the annual reduction once. Amounts retain fractional PLN until display formatting; per-payment contribution rounding, whole-PLN PIT rounding, payroll advances and annual refunds are not modelled. This can differ from payroll by small rounding amounts even where all other assumptions match.

**B2B:** one selected ryczałt rate, one business, invoice revenue excluding VAT, the selected minimum ZUS profile and optional sickness insurance. Social insurance and FP/FS are separate: both reduce spendable income, but FP/FS reduces neither ryczałt taxable revenue nor the revenue used to select the health tier. Taxable revenue deducts social insurance and half of health contributions.

The model provisions the final annual health tier for every active month using the published monthly contribution. Contributions are assumed paid in the modelled year. Actual monthly health payments may initially use a lower tier; the subsequent settlement, its payment date, annual health-base rounding and the tax year of its deduction require a payment ledger and are outside this estimate. Expense deductions, mixed ryczałt rates, VAT, relief eligibility, Mały ZUS Plus, ZUS holidays, age-based exemptions, special PIT reliefs and simultaneous employment/business are not modelled.

The quick calculator holds the selected profile constant for the year to compare assumptions. **Selecting Ulga na start does not establish eligibility or mean it lasts twelve months.** Its ordinary maximum is six full calendar months; preferential contributions can then apply for 24 months if eligible. Scenario callers supply the correct profile per month explicitly. No future-year rates or automatic eligibility decisions are invented.

A zero-revenue active B2B month still has contributions. Set `active: false` and `gross: 0` for an inactive month. Scenarios preserve negative annual cash results; the quick calculator displays zero available take-home and the money breakdown discloses a contribution shortfall for positive invoices that do not cover costs.

## Monthly scenarios

Each call takes exactly twelve chronological entries for one registered tax year. Rows contain contribution components and taxable income (UoP) or provisioned health (B2B), **not monthly net payslips**. Annual PIT is calculated once from the complete year. Inactive months can represent starting or ending work mid-year; each call starts with fresh annual accumulators.

```ts
import { DEFAULT_TAX_PROFILE } from "../src/config/tax"
import { calculateB2BScenario, constantIncomeYear } from "../src/lib/tax/scenarios"

// Explicit assumption: an eligible business starts on January 1.
const months = constantIncomeYear(10000, DEFAULT_TAX_PROFILE).map((month, index) => ({
  ...month,
  profile: {
    ...month.profile,
    b2b: { ...month.profile.b2b, zusProfile: index < 6 ? "ulgaNaStart" as const : "preferential" as const },
  },
}))
const result = calculateB2BScenario(months, 2026)
```

For constant-income reverse calculations, UoP expands the search until it brackets the target. B2B searches health tiers in ascending order because net falls at a tier transition and there can be more than one gross value for the same target. Results must reach the requested net within one grosz; failure is explicit.

## Independent verification

`src/lib/tax/fixtures/2026.json` contains fixed reference results calculated separately with decimal arithmetic, without importing production code or configuration. Do not regenerate expectations from the engine under test. Changing a rule requires rechecking the source and independently recalculating affected fixtures.

Examples under the unrounded annual-average model:

| Scenario | Social / month | FP/FS / month | Health / month | PIT / month | Net / month |
|---|---:|---:|---:|---:|---:|
| UoP 5,000 gross, standard KUP, no PPK | 685.50 | — | 388.305 | 187.74 | 3,738.455 |
| UoP 5,000 gross, basic PPK | 685.50 | — | 388.305 | 196.74 | 3,629.455 |
| B2B 20,000 invoice, 12%, full ZUS, no sickness | 1,649.82 | 138.47 | 830.58 | 2,152.1868 | 15,228.9432 |

For the first example: employee social contributions are `60000 × (9.76% + 1.5% + 2.45%) = 8226` annually. The health base is `60000 − 8226`; the PIT base is `60000 − 8226 − 3000 = 48774`. Annual PIT is `48774 × 12% − 3600 = 2252.88`. With PPK, employer contributions add 900 to that annual PIT base and employee contributions subtract 1200 from annual take-home.

For the B2B example: monthly taxable revenue is `20000 − 1649.82 − 830.58 / 2 = 17934.89`. FP/FS is a cash payment only. Net is `20000 − 1649.82 − 138.47 − 830.58 − 17934.89 × 12%`.

Tests cover reference examples, PIT and health boundaries, annual social-cap crossing, PPK, variable income, changing ZUS profiles, inactive months, shortfalls, invalid inputs, unsupported years and inverse calculations. Integration tests verify that Compare and money breakdowns consume the same engine.

## Sources and maintenance

- [PIT scale and ryczałt rates — Ministry of Finance](https://www.podatki.gov.pl/podatki-firmowe/pit/stawki-i-limity)
- [Employee income and KUP — Ministry of Finance](https://www.podatki.gov.pl/podatki-osobiste/pit/informacje-podstawowe/co-jest-opodatkowane/dochody-z-pracy)
- [2026 contributions and annual cap — ZUS](https://www.zus.pl/firmy/rozliczenia-z-zus/skladki-na-ubezpieczenia)
- [Employee contribution funding — ZUS](https://www.zus.pl/documents/10182/167561/Jestes_pracownikiem.pdf/a049dc44-6680-4a0e-b07a-60adc7dc01eb) (use for funding/rates; its historical annual-cap amount is not used)
- [Employee health base — ZUS](https://www.zus.pl/pracujacy/ubezpieczenie-zdrowotne-w-polsce/podstawa-wymiaru-skladek-na-ubezpieczenie-zdrowotne)
- [Low-pay health cap — ZUS](https://www.zus.pl/o-zus/o-nas/programy-transformacji-cyfrowej-zus/zmiany-od-2022-r./zmiany-w-skladce-zdrowotnej)
- [Health deduction — Ministry of Finance](https://www.podatki.gov.pl/ulgi-i-odliczenia/odliczenie-skladek-na-ubezpieczenie-zdrowotne-pit)
- [ZUS deductions and FP/FS — biznes.gov.pl](https://www.biznes.gov.pl/pl/portal/00230)
- [Employer PPK taxation — official PPK portal](https://www.mojeppk.pl/faq/pracownik/podatki-i-skladki-zus_jaki-podatek-zaplaci-pracownik-od-wplaty-pracodawcy.html)
- [PPK contribution rates — official PPK portal](https://www.mojeppk.pl/dla-pracownika/artykul.html)
- [Ulga na start and preferential contributions — ZUS](https://www.zus.pl/en/-/ulga-na-start-preferencyjna-podstawa-dzialalnosc-nieewidencjonowana-jakie-sa-warunki-uprawnienia-i-skutk-1)

For a new year, add and register an independently sourced ruleset, verify formulas and reference cases, then update the default year and year-specific UI copy together. Run `pnpm test:run`, `pnpm type-check` and `pnpm build`. An existing year's values must not be overwritten with the next year's rates.
