# Issue #3 Implementation Guide
## Figma Design Migration – Decisions & Architecture

**Status:** Ready to implement  
**Date:** 2026-08-28  
**Grilling session:** Completed—all critical decisions locked

---

## Decisions Log

### Scope & Organization
| Decision | Choice | Why |
|----------|--------|-----|
| **Component architecture** | Refactor into focused presentational components | Clear separation prevents state/calculation duplication; boundaries are safety. |
| **Build approach** | Parallel desktop + mobile responsive (not sequential) | One component tree avoids divergence; test both widths from day one. |
| **Merge strategy** | One atomic PR (not phased) | "One source of truth" rule requires single state point; split PRs risk state divergence. |
| **Scope** | UI migration only—no feature changes, no calculation logic duplication | Strict adherence to this prevents scope creep. |

### State & Logic
| Decision | Choice | Why |
|----------|--------|-----|
| **State passing** | Prop drilling (no Context yet) | Visible data flow prevents hidden dependencies; easier to refactor later if needed. |
| **Calculation flow** | Replicate existing App.tsx pattern (match today's behavior) | One source of truth lives in App; new components call same functions. |
| **Settings modal ownership** | Keep in App.tsx, triggered by callback from Input Panel | Modal state is workflow, not presentation. |
| **Quick scenarios** | Keep constant array in App.tsx; pass as prop to Input Panel | One location, easy to find; no duplication. |
| **Comparison page** | Reuse existing ComparisonPage; check current state handoff pattern | No new comparison engine. |
| **i18n** | Keep prop drilling: pass `t: typeof T["en"]` object down | Matches existing pattern; straightforward, no new abstraction. |

### UI & Styling
| Decision | Choice | Why |
|----------|--------|-----|
| **CSS framework** | Tailwind CSS v4 (already in stack) | No new dependency; responsive utilities built-in. |
| **Responsive approach** | Tailwind default breakpoints + manual test at Figma sizes (1440px, 390px) | Default breakpoints prevent brittle designs; manual testing catches alignment misses. |
| **Typography** | Tailwind responsive utilities (`sm:text-lg md:text-2xl`) | Extract sizes from Figma; avoids magic numbers. |
| **Results layout** | Tailwind Grid: `grid-cols-1 md:grid-cols-2` | Responsive, clean; check Figma for exact column count per breakpoint. |
| **Slider input** | Native HTML `<input type="range">` | Keyboard-accessible, mouse/touch-draggable; Tailwind can style it. |
| **Slider outside range** | Clamp display to min/max; don't disable | Slider always responsive; user can drag back into range. |

### Implementation Details
| Decision | Choice | Why |
|----------|--------|-----|
| **Currency formatting** | Use existing `fmt(amount, currency, decimals)` from App.tsx | Single source of truth; don't duplicate formatting logic. |
| **Calculation performance** | No debouncing on amount/slider changes | Issue doesn't report perf problems; optimize calculation logic if slow, not UI. |
| **Analytics** | Wire same calls as existing components for same user actions | Match existing behavior; grep for `analytics.` to find all calls. |
| **State preservation** | Preserve calculator state across navigation (e.g., back from Compare Offers) | Better UX; match current behavior. |
| **Empty state** | Match current app behavior (check what it does with amount = 0) | Don't invent new states. |
| **Input validation** | Match existing constraints (min/max, non-numeric handling) | Don't add validation that doesn't exist. |

### Testing
| Decision | Choice | Why |
|----------|--------|-----|
| **Test scope** | Unit/vitest tests for critical flows only: amount ↔ slider sync, mode/currency switching, profile save/load | Minimal but focused; manual testing catches visual/responsive issues. |
| **Manual testing** | Desktop & mobile at Figma reference widths (1440px, 390px) + real devices | Automated tests don't catch alignment or responsive breakpoint surprises. |

---

## Component Tree

Illustrative (not mandatory). Key: state/calc logic in App, presentation in focused components.

```
App
├── Header
│   └── Navigation (compare, settings, language)
├── Hero
├── CalculatorWorkspace
│   ├── CalculatorInputPanel
│   │   ├── InputModeToggle (gross/net)
│   │   ├── AmountInput + QuickAmountSlider (synced)
│   │   ├── CurrencySwitcher
│   │   ├── TaxProfileSummary (B2B/UoP; triggers settings modal)
│   │   └── QuickScenarios
│   └── CalculatorResults
│       ├── B2BResultCard (live calculation)
│       ├── UoPResultCard (live calculation)
│       ├── CompareOffersCTA
│       ├── RecruiterMessageCard
│       └── CalculationInfo / Breakdown
├── TrustStrip / Footer
└── Modals (stay in App.tsx)
    ├── B2BSettingsModal
    └── UoPSettingsModal
```

---

## Critical Implementation Rules

1. **One source of truth for calculator state and calculations**
   - State lives in App.tsx
   - All calculations use existing `calculateB2B*` / `calculateUoP*` functions
   - New components receive state as props, never maintain duplicate state

2. **Do not hardcode Figma example values**
   - Example values in Figma (e.g., "25k PLN", "$5,000") are visual references only
   - All monetary values must be live, reactive calculations

3. **Preserve all existing behavior**
   - Desired net mode → calculates both B2B and UoP equivalents
   - Currency switching → all values update
   - Profile save/load → persisted and updates results
   - Analytics events → wire same calls for same actions
   - Language switching → all text translates

4. **Build complex components first**
   - Start with Input Panel (highest risk: state/calculation sync)
   - Then Results cards
   - Then presentational components (Header, Hero, Footer)

5. **Delete old components immediately**
   - No dead code left in merged PR
   - Makes the story clean

---

## Existing Functions & Patterns to Reuse

| What | Location | Usage |
|------|----------|-------|
| Currency formatting | `App.tsx` line ~100: `fmt(amount, currency, decimals)` | Format all monetary displays |
| Exchange rates | `App.tsx` line ~89: `RATES`, `toPLN()`, `fromPLN()` | Currency conversion |
| Calculations | `src/lib/taxCalculations.ts`: `calculateB2BFromGross`, `calculateB2BFromNet`, `calculateUoPFromGross`, `calculateUoPFromNet` | Live results in cards |
| Tax profile state | `src/lib/useTaxProfile.ts` | Persist B2B/UoP settings |
| Translations | `App.tsx` line ~12: `T` object keyed by language | Pass `t: typeof T["en"]` as prop |
| Quick scenarios | `App.tsx` line ~280: `quickScenarios` array | Pass as prop to Input Panel |
| Analytics | `src/lib/analytics.ts` | Wire same calls (grep for `analytics.`) |

---

## TypeScript Props Pattern

All new components should have explicit interfaces:

```typescript
interface CalculatorInputPanelProps {
  amount: number;
  currency: Currency;
  inputType: InputType;
  onAmountChange: (amount: number) => void;
  onCurrencyChange: (currency: Currency) => void;
  onInputTypeChange: (type: InputType) => void;
  onOpenB2BSettings: () => void;
  onOpenUoPSettings: () => void;
  quickScenarios: typeof quickScenarios;
  taxProfile: typeof usedTaxProfile;
  t: typeof T["en"];
}

export function CalculatorInputPanel(props: CalculatorInputPanelProps) {
  // ...
}
```

Explicit contracts prevent prop-drilling mistakes and document component dependencies.

---

## Testing Strategy

### Unit tests (vitest)
- Amount ↔ Slider synchronization
- Mode switching (gross ↔ net) recalculates
- Currency switching updates all values
- Profile save/load updates results
- Slider clamping outside range

### Manual testing
- Desktop layout @ 1440px matches Figma frame 2:2
- Mobile layout @ 390px matches Figma frame 2:9
- Intermediate widths (768px, 1024px) have no overflow/clipping
- Keyboard navigation (Tab, Arrow keys on slider)
- Mobile: number input keyboard, focus management
- Back from Compare Offers: state preserved
- Language switching: all text translates
- Analytics: events fire for same user actions as before

### Acceptance checklist
See issue #3 for full checklist. Key items:
- [ ] Visuals match Figma (both breakpoints)
- [ ] No calculation logic duplicated in components
- [ ] All existing functionality preserved
- [ ] Type check, tests, build pass
- [ ] No horizontal overflow or responsive regressions

---

## Development Workflow

1. **Setup & discovery** (30 min)
   - Open Figma side-by-side
   - Skim current App.tsx (state, modals, calculations)
   - Check what empty state looks like (amount = 0)
   - Note analytics event names

2. **Input Panel** (2–3 hours)
   - Break into focused subcomponents
   - Wire state props, callbacks
   - Sync amount ↔ slider (critical)
   - Test at 1440px first, then 390px
   - Write tests for sync

3. **Results Cards** (1–2 hours)
   - B2BResultCard, UoPResultCard (take live calc results, format with `fmt()`)
   - CompareOffersCTA, RecruiterMessageCard
   - Grid layout responsive
   - Wire analytics calls

4. **Presentational layers** (1 hour)
   - Header, Hero, Footer/Trust
   - Match Figma spacing/typography

5. **Integration & validation** (1 hour)
   - Modals open/close from Input Panel
   - Compare Offers navigation works
   - Full flow: amount → calculations → results → copy message
   - Manual test at Figma widths + in-between breakpoints
   - Keyboard nav, mobile UX

6. **Tests & cleanup** (30 min)
   - Run `npm run type-check`, `npm test`, `npm run build`
   - Delete old components
   - One final manual pass

---

## What NOT to Do

- ❌ Copy tax formulas into new components
- ❌ Hardcode Figma example numbers
- ❌ Create separate desktop/mobile state logic
- ❌ Change existing calculation formulas
- ❌ Skip analytics event wiring
- ❌ Remove supported languages/features
- ❌ Refactor unrelated code
- ❌ Add roadmap features (job analysis, accounts, AI, etc.)
- ❌ Debounce calculations
- ❌ Leave dead code in final PR

---

## References

- **Figma desktop:** https://www.figma.com/design/Il3ilCQgUM7klsUdav1r1Y/ApproxMate-%E2%80%94-Product---UX-Redesign?node-id=2-2
- **Figma mobile:** https://www.figma.com/design/Il3ilCQgUM7klsUdav1r1Y/ApproxMate-%E2%80%94-Product---UX-Redesign?node-id=2-9
- **Issue:** #3 (this is the detailed spec)
- **Current codebase:** App.tsx (state), src/lib/*.ts (calculations), src/components/* (existing components)

---

**You are now ready to implement. Trust the decisions; they're locked.** 🚀
