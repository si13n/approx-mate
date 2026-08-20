# Polish Tax Rules 2026

**Official sources:** ZUS, podatki.gov.pl, NBP

---

## Exchange Rates

| Currency | Rate |
|----------|------|
| PLN | 1.0 |
| USD | 3.85 |
| EUR | 4.25 |

Updated daily via GitHub Actions.

---

## B2B (Ryczałt)

### Ryczałt Rates

Selectable: **8.5%, 12%, 14%, 15%, 17%**

Default: **12%** (common for IT services)

⚠️ Your actual rate depends on PKWiU code and service type. Check with accountant.

### ZUS (Social Insurance)

Three profiles available:

#### 1. **Full ZUS** ← Default
- Social contribution: **1,788.29 PLN/month**
- With voluntary sickness: **1,926.76 PLN/month**
- Best for stable, higher income

#### 2. **Preferential ZUS**
- Social contribution: **420.86 PLN/month**
- With voluntary sickness: **456.18 PLN/month**
- Lower threshold for eligibility

#### 3. **Ulga na start** (Startup Relief)
- Social contribution: **0 PLN/month** (temporary)
- Health insurance: Still required
- For newly self-employed (limited time)

### Health Insurance (Zdrowotna)

**Automatic** based on annual revenue (net of ZUS):

| Annual Revenue | Monthly Health |
|---|---|
| ≤ 60,000 PLN | 498.35 PLN |
| 60,001 – 300,000 PLN | 830.58 PLN |
| > 300,000 PLN | 1,495.04 PLN |

### Sickness Insurance (Składka Chorobowa)

Optional: **2.45%** of contribution base

Only available with Full or Preferential ZUS.

### Tax Base Calculation

```
taxable revenue
= gross revenue
  - social ZUS contributions
  - (50% × health contributions)

tax = taxable revenue × ryczałt rate
```

---

## UoP (Employment)

### Income Tax (PIT)

**Brackets (annual):**
| Income | Rate |
|---|---|
| Up to 120,000 PLN | 12% |
| Above 120,000 PLN | 32% |

**Tax reduction:** 3,600 PLN/year (300 PLN/month average)

**Calculation is annual-first** to ensure threshold accuracy.

### Social Insurance (ZUS) — Employee

| Type | Rate | Note |
|---|---|---|
| Pension (Emerytalne) | 9.76% | Capped annually |
| Disability (Rentowe) | 1.5% | Capped annually |
| Sickness (Chorobowa) | 2.45% | Full month only |
| Work accident (Wypadkowe) | 1.67% | Employer pays |

**Annual cap:** 282,600 PLN (pension + disability only)

### Health Insurance (Zdrowotna)

**9% of:**
```
gross salary
- pension contribution
- disability contribution
```

Not deductible from tax (unlike ZUS).

### KUP (Tax-Deductible Costs)

Selectable:
- **Standard: 250 PLN/month**
- **Commuter: 300 PLN/month** (if workplace in different town)

Default: **Standard (250 PLN)**

### PPK (Workplace Savings Fund)

**Optional:** Employee **2%** + Employer **1.5%**

Default: **Off**

Employee contribution reduces take-home (no tax benefit currently).

### Calculation Example

```
Monthly gross: 5,000 PLN
Annual gross: 60,000 PLN

Annual ZUS (pension + disability):
5,000 × (0.0976 + 0.015) × 12 = 8,049.60 PLN
(Under annual cap of 282,600)

Annual health (9% of reduced base):
(60,000 - 5,853.60) × 0.09 = 4,873.01 PLN

Taxable (for PIT):
60,000 - 5,853.60 - 3,000 (KUP) = 51,146.40 PLN

PIT (12% bracket, under 120k threshold):
51,146.40 × 0.12 - 3,600 = 2,537.57 PLN

Annual net:
60,000 - 8,049.60 - 4,873.01 - 2,537.57 = 44,540 PLN

Average monthly: 44,540 ÷ 12 = 3,712 PLN
```

---

## Key Differences: B2B vs UoP

| | B2B | UoP |
|---|---|---|
| **Tax rate** | Ryczałt (8.5%-17%) | Progressive (12%-32%) |
| **ZUS** | Optional profiles | Mandatory |
| **Health** | Income-tiered | Fixed 9% |
| **Flexibility** | Customizable | Standard |
| **Risk** | Responsibility for books | Employer handles |
| **Avg. benefit** | Often higher net | Stability, benefits |

---

## When to Use Each Profile

### B2B Full ZUS
✅ Stable income > 10k/month  
✅ Long-term contracts  
✅ Want to build ZUS history  

### B2B Preferential ZUS
✅ Income 5-10k/month  
✅ Eligible (startup, etc.)  
✅ Lower fixed costs  

### B2B Ulga na start
✅ Newly self-employed  
✅ First 24 months  
✅ Building business  

### UoP
✅ Want simplicity  
✅ Employment benefits  
✅ Tax not a focus  

---

## Updates & Maintenance

This documentation reflects **2026 rules**.

**When legislation changes:**
1. Update `src/config/tax/2026.ts`
2. Include official source link
3. Add version note
4. Run tests (`npm test`)

**To add a new country:** Duplicate the tax config file and modify values.

---

## Official Sources

- **ZUS** — https://www.zus.pl/ (contribution tables, caps)
- **Ministerstwo Finansów** — https://www.podatki.gov.pl/ (tax brackets, deductions)
- **NBP** — https://api.nbp.pl/ (exchange rates)

Always verify current rates with official sources before contracts.

**This calculator provides estimates, not tax advice.**
