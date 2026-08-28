# Google Analytics 4 Events Reference

Complete list of events tracked in Approxmate.

## Events Summary

| Event | Fires When | Parameters | Purpose |
|-------|-----------|-----------|---------|
| `page_view` | Page loads | (none) | Track calculator sessions |
| `calculator_used` | User enters valid amount | (none) | Count active users |
| `mode_changed` | Toggle net/gross | `mode` | Understand preference |
| `currency_changed` | Change USD/EUR/PLN | `currency` | Track market interest |
| `language_changed` | Switch EN/PL/UA | `language` | Track language usage |
| `recruiter_message_copy` | Copy message button | (none) | Track feature usage |
| `quick_scenario_click` | Click preset | `scenario` | Understand popular rates |
| `feedback_click` | Click feedback link | (none) | Track engagement |

---

## Detailed Event Descriptions

### `page_view`
**Fires:** When the calculator page loads

**Parameters:** None

**Use Case:** Track total calculator sessions and return visitors

**Example in GA4 Reports:**
- Reports → Real-time → See active users
- Reports → Events → page_view count

---

### `calculator_used`
**Fires:** When user enters a salary amount > 0

**Parameters:** None

**Use Case:** Count how many users actually use the calculator

**Example in GA4 Reports:**
- Compare `calculator_used` vs `page_view` to get engagement rate
- Users who view page but don't calculate are potential dropoff points

---

### `mode_changed`
**Fires:** When user toggles between "Net" and "Gross" mode

**Parameters:**
- `mode` (string): `"net"` or `"gross"`

**Use Case:** Understand which calculation mode users prefer

**Example in GA4 Reports:**
1. Go to Reports → Events
2. Click `mode_changed`
3. Click parameter `mode` to see breakdown:
   - "net" - users calculating desired take-home
   - "gross" - users calculating from offered amount

**Analysis Ideas:**
- Which mode is more popular?
- Do users switch modes often?
- Correlate with geography or job type

---

### `currency_changed`
**Fires:** When user changes currency (USD, EUR, or PLN)

**Parameters:**
- `currency` (string): `"USD"`, `"EUR"`, or `"PLN"`

**Use Case:** Understand which markets use the calculator

**Example in GA4 Reports:**
1. Go to Reports → Events
2. Click `currency_changed`
3. See parameter breakdown:
   - USD - international/remote workers
   - EUR - Western European
   - PLN - local Polish market

**Analysis Ideas:**
- Which currency users stick with?
- Do non-USD users switch currencies?
- Traffic patterns by market

---

### `language_changed`
**Fires:** When user switches language (EN, PL, or UA)

**Parameters:**
- `language` (string): `"EN"`, `"PL"`, or `"UA"`

**Use Case:** Track language preferences and reach

**Example in GA4 Reports:**
1. Go to Reports → Events
2. Click `language_changed`
3. See breakdown of language usage:
   - EN - English speakers (international)
   - PL - Polish speakers
   - UA - Ukrainian speakers

**Analysis Ideas:**
- Primary language per country
- Do users change language mid-session?
- Which languages need improvement?

---

### `recruiter_message_copy`
**Fires:** When user clicks "Copy" on the recruiter message

**Parameters:** None

**Use Case:** Track adoption of the recruiter message feature

**Example in GA4 Reports:**
- Calculate feature adoption: `recruiter_message_copy` / `calculator_used` × 100
- Time from calculator use to message copy
- Users who copy the message are likely job hunting

**Analysis Ideas:**
- Is the feature discoverable?
- Do users find it useful?
- What salary ranges trigger more copies?

---

### `quick_scenario_click`
**Fires:** When user clicks a quick preset button ($3k net, $4k net, etc.)

**Parameters:**
- `scenario` (string): The preset label, e.g., `"$3k net"`, `"€3.5k net"`, `"20k PLN gross"`

**Use Case:** Understand which salary ranges are most interesting to users

**Example in GA4 Reports:**
1. Go to Reports → Events
2. Click `quick_scenario_click`
3. See parameter breakdown:
   - $3k net - popular starting point
   - $5k net - mid-range interest
   - 20k PLN gross - local option

**Analysis Ideas:**
- Most popular preset = baseline interest
- Are USD users different from PLN users?
- Time to interact with preset = engagement metric
- Do users click preset then adjust with slider?

---

### `feedback_click`
**Fires:** When user clicks the feedback email link

**Parameters:** None

**Use Case:** Track feature requests and support engagement

**Example in GA4 Reports:**
- Count feedback_click events
- Compare to total users for support engagement rate
- Likely indicates user is satisfied enough to provide feedback (good sign!)

**Analysis Ideas:**
- How many users provide feedback?
- Correlate with usage duration
- Users who click feedback tend to be engaged users

---

## How to View Events in GA4

### View Real-time Events
1. Google Analytics → Reports → Real-time
2. Use the calculator
3. Events appear instantly (when DebugView is enabled)

### View Historical Events (24-48 hrs later)
1. Google Analytics → Reports → Events
2. Click on event name
3. See event count and parameters

### Filter by Parameter
1. In Events report, click an event
2. Click a parameter (e.g., `currency`)
3. See breakdown by parameter value

### Custom Dashboards
1. GA4 → Dashboards → Create
2. Add cards like:
   - "Events per Currency" - track market breakdown
   - "Mode Changed over time" - track preference changes
   - "Feature Adoption" - message_copy / calculator_used ratio

---

## Privacy & What's NOT Tracked

**We intentionally do NOT track:**
- ❌ Salary amounts (entered)
- ❌ Calculated net/gross values
- ❌ Hourly rates
- ❌ Recruiter message text
- ❌ Any personally identifiable information (PII)

**Privacy features enabled:**
- ✅ IP anonymization
- ✅ No Google Signals (behavioral tracking)
- ✅ No ad personalization signals
- ✅ No cookie consent required

---

## Integration with Analytics

### Track in Analytics Module

Events are fired from `src/lib/analytics.ts`:

```typescript
export function trackModeChanged(mode: "net" | "gross"): void {
  gtag("event", "mode_changed", { mode });
}
```

### Called from UI

In `src/App.tsx`:

```typescript
onClick={() => { setInputType(v); trackModeChanged(v); }}
```

### Add New Events

1. Add function to `src/lib/analytics.ts`
2. Call it from component onclick/onChange
3. Event appears in GA4 within minutes (or instantly in DebugView)

---

## Useful Resources

- [GA4 Event Reference](https://support.google.com/analytics/answer/9322688)
- [Debugging GA4 Events](https://support.google.com/analytics/answer/10229268)
- [GA4 Real-time Debugging](https://support.google.com/analytics/answer/12052034)
