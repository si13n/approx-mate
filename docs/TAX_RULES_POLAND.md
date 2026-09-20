# Polish tax estimates — 2026

ApproxMate has one configured ruleset: 2026. Results are annual estimates divided by twelve. They are not payroll slips, tax returns, or tax advice.

## What is modelled

### B2B

- One invoice revenue amount, excluding VAT.
- One selected ryczałt rate: 8.5%, 12%, 14%, 15%, or 17%; the default is 12%.
- Selected ZUS profile: Ulga na start, preferential, or full ZUS.
- Social insurance and FP/FS are treated separately; FP/FS is a cash cost, not a tax deduction.
- Health contribution is selected from annual revenue tiers. Half of health contributions is deductible from ryczałt revenue.

### UoP

- PIT brackets of 12% and 32%, with a PLN 3,600 annual tax reduction.
- Employee pension, disability, and sickness contributions.
- 9% health contribution.
- KUP of PLN 250 or PLN 300 per month.
- Employee PPK of 2% and employer PPK of 1.5%.
- Annual social-contribution base cap of PLN 282,600.

## Important limitations

- The calculator assumes constant income and a selected profile for the year.
- Scenario APIs accept twelve chronological months and can mark months inactive.
- Annual PIT is calculated from the complete year; monthly payroll rounding and payment advances are not modelled.
- VAT, mixed ryczałt rates, special reliefs, Mały ZUS Plus, ZUS holidays, age exemptions, and simultaneous employment/business are not modelled.
- B2B health calculations provision the final annual tier for active months; later settlement timing is not modelled.

## Source code

- Rules: `src/config/tax/2026.ts`
- Rules registry: `src/config/tax/index.ts`
- Calculation engine: `src/lib/tax/` and `src/lib/taxCalculations.ts`
- Reference fixtures: `src/lib/tax/fixtures/2026.json`

## Official sources

- [PIT rates and ryczałt](https://www.podatki.gov.pl/podatki-firmowe/pit/stawki-i-limity)
- [ZUS contributions](https://www.zus.pl/firmy/rozliczenia-z-zus/skladki-na-ubezpieczenia)
- [Employee income and KUP](https://www.podatki.gov.pl/podatki-osobiste/pit/informacje-podstawowe/co-jest-opodatkowane/dochody-z-pracy)
- [Employee health contribution](https://www.zus.pl/pracujacy/ubezpieczenie-zdrowotne-w-polsce/podstawa-wymiaru-skladek-na-ubezpieczenie-zdrowotne)
