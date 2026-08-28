# Issue #3 – Figma Design Migration
## One-Page Decision Summary

**Grilling session complete.** All critical decisions locked. Ready to implement.

---

## The Ask
Implement the new Figma main-page design (desktop + mobile) without changing features or calculation logic. UI/UX migration only.

---

## How You'll Build It

| Aspect | Decision |
|--------|----------|
| **Architecture** | Refactor into focused presentational components (no monolith). State stays in App.tsx. |
| **Responsive** | Parallel desktop + mobile (one tree, Tailwind responsive CSS). Test at 1440px and 390px. |
| **PR Strategy** | One atomic PR (not phased). Reduces risk of state divergence. |
| **Order** | Complex first: Input Panel → Results Cards → Header/Footer. |
| **State passing** | Prop drilling (straightforward, no Context yet). |
| **Styling** | Tailwind v4 (already in stack). Default breakpoints + manual test at Figma widths. |
| **Testing** | Unit/vitest for critical flows (sync, mode/currency/profile changes). Manual for visual/responsive. |

---

## What You'll Reuse (Don't Duplicate)

| Item | Location | How |
|------|----------|-----|
| `fmt()` function | App.tsx ~100 | Use for all currency formatting |
| Calculations | `src/lib/taxCalculations.ts` | Call same functions; don't reimpl |
| `T` (translations) | App.tsx ~12 | Pass `t` object as prop (match pattern) |
| `quickScenarios` | App.tsx ~280 | Pass as prop to Input Panel |
| Settings modals | App.tsx | Trigger via callback; keep in App |
| Analytics calls | `src/lib/analytics.ts` | Wire same calls for same actions |
| Tax profile state | `src/lib/useTaxProfile.ts` | Use existing hook; don't duplicate |

---

## Slider Behavior

- **Synced with amount input** – always stay in sync
- **Outside slider range?** Clamp display to max; don't disable
- **Input type:** Native HTML `<input type="range">` (keyboard-accessible)

---

## Component Structure (Illustrative)

```
App (state/logic) ──→ CalculatorWorkspace
                       ├─ InputPanel (focused subcomponents)
                       │  ├─ AmountInput + QuickAmountSlider (synced)
                       │  ├─ CurrencySwitcher
                       │  ├─ InputModeToggle
                       │  ├─ TaxProfileSummary (→ callback to open modal)
                       │  └─ QuickScenarios
                       └─ ResultsPanel
                          ├─ B2BResultCard (live calc)
                          ├─ UoPResultCard (live calc)
                          ├─ CompareOffersCTA
                          ├─ RecruiterMessageCard
                          └─ CalculationInfo

Modals (stay in App):
├─ B2BSettingsModal
└─ UoPSettingsModal
```

All prop types explicit (TypeScript interfaces).

---

## Key Rules

1. **One source of truth:** All state and calculations in App.tsx
2. **No hardcoded Figma values:** 25k PLN / $5,000 are visual examples only; use live calculations
3. **No feature changes:** Preserve every existing behavior (mode, currency, profile, analytics, language)
4. **No calculation duplication:** New components consume existing results, don't recalculate
5. **Delete old components** when done—no dead code

---

## Performance & Edge Cases

- **No debouncing** on amount/slider changes (assumption: existing calc is fast enough)
- **Empty state** – match current behavior (check what amount=0 shows)
- **Input validation** – match existing constraints (don't add new validation)
- **State across navigation** – preserve (e.g., back from Compare Offers)

---

## Manual Test Checklist

At **1440px (desktop)** and **390px (mobile)**:
- [ ] Layout matches Figma frames exactly
- [ ] Amount ↔ Slider stay synced
- [ ] Gross/Net mode switching updates both B2B and UoP
- [ ] Currency switching (PLN/USD/EUR) updates all values
- [ ] B2B settings open/save/update results
- [ ] UoP settings open/save/update results
- [ ] Compare Offers CTA opens existing page
- [ ] Back from Compare Offers: state preserved
- [ ] Recruiter message uses current state
- [ ] Copy message button works
- [ ] Language switching (EN/PL/UA) translates all text
- [ ] Analytics events fire (grep for `analytics.`)
- [ ] No horizontal overflow, no clipped text
- [ ] Keyboard navigation works (Tab, Arrows on slider)

---

## Run Before Merge

```bash
npm run type-check
npm test
npm run build
```

---

## You're Ready

Start with the **Input Panel**. Open Figma side-by-side. Build focused components. Wire props. Sync the slider. Test at both widths. Done right, this is 3–4 hours of careful, high-confidence work.

**Trust the plan. All decisions locked.** 🎯
