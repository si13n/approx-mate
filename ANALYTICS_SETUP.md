# Google Analytics 4 Setup Guide

This document explains how to set up and configure Google Analytics 4 (GA4) for the Approxmate calculator.

## 1. Create a GA4 Property

### Step 1: Go to Google Analytics
- Visit [Google Analytics](https://analytics.google.com)
- Sign in with your Google account

### Step 2: Create a New Property
- Click **Admin** (bottom left)
- Under **Property**, click **Create Property**
- Property name: `Approxmate` (or your preferred name)
- Set up for: Website
- Reporting timezone: Choose your timezone
- Currency: USD (or your currency)
- Click **Create**

### Step 3: Set Up Data Stream
- In the **Data collection and modification** section, click **Data streams**
- Click **Add stream**
- Stream type: **Web**
- Website URL: `https://yourdomain.com` (or your GitHub Pages URL)
  - Example: `https://si13n.github.io/approx-mate/`
- Stream name: `Approxmate Web`
- Click **Create stream**

### Step 4: Find Your Measurement ID
- In the **Data stream details**, you'll see:
  - **Measurement ID**: `G_XXXXXXXXXX` (this is what you need)
  - Copy this value

## 2. Add Measurement ID to Your Project

### Create a `.env.local` File
In the project root (same level as `package.json`), create a `.env.local` file:

```
VITE_GA_MEASUREMENT_ID=G_XXXXXXXXXX
```

Replace `G_XXXXXXXXXX` with your actual Measurement ID.

**Important:** The `.env.local` file is gitignored and will not be committed.

### For Production (GitHub Pages)
You have two options:

**Option A: GitHub Secrets (Recommended)**
1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click **New repository secret**
4. Name: `GA_MEASUREMENT_ID`
5. Value: Paste your Measurement ID
6. Save

Update your build/deploy workflow to use:
```yaml
- name: Build
  env:
    VITE_GA_MEASUREMENT_ID: ${{ secrets.GA_MEASUREMENT_ID }}
  run: npm run build
```

**Option B: Hardcode in Production**
If you don't have GitHub Actions setup, you can set the env var before building:
```bash
export VITE_GA_MEASUREMENT_ID=G_XXXXXXXXXX
npm run build
```

## 3. Local Development Testing

### Start the Dev Server
```bash
npm run dev
```

The app will use the Measurement ID from `.env.local`.

### Verify GA4 is Loading
1. Open the app in browser
2. Open DevTools → Console
3. You should see: `[Analytics] GA4 initialized with measurement ID: G_XXXXXXXXXX`

### Enable GA4 DebugView
This lets you see events in real-time without the 24-48 hour processing delay.

1. In Google Analytics, go to **Admin** → **Property settings**
2. Scroll to **Event settings** → **Logging Settings**
3. Enable **Debug view**
4. In your browser, install [Google Analytics Debugger Extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcicaksnog4gcopjco)
5. Open your app and refresh
6. In GA, go to **Admin** → **Property settings** → **Debug view**
7. You should see events appear in real-time

## 4. Verify Events in GA4

### Real-time Events (24+ hours after setup)
1. In Google Analytics, go to **Reports** → **Real-time**
2. Use the calculator and watch events appear

### Check Event Schema
1. Go to **Admin** → **Event creation**
2. You should see these custom events:
   - `calculator_used`
   - `mode_changed`
   - `currency_changed`
   - `hours_changed` (currently unused)
   - `language_changed`
   - `recruiter_message_copy`
   - `quick_scenario_click`
   - `feedback_click`

### View Event Parameters
1. Go to **Reports** → **Events**
2. Click on an event (e.g., `currency_changed`)
3. You'll see parameters like `currency: USD`, `currency: EUR`, etc.

## 5. Event Tracking Details

### What Gets Tracked
- **Page views** - When user loads the page
- **calculator_used** - When user enters a valid salary amount
- **mode_changed** - When user switches between "net" and "gross" mode
  - Parameter: `mode` (net | gross)
- **currency_changed** - When user changes currency
  - Parameter: `currency` (USD | EUR | PLN)
- **language_changed** - When user changes language
  - Parameter: `language` (EN | PL | UA)
- **recruiter_message_copy** - When user copies the recruiter message
- **quick_scenario_click** - When user clicks a quick preset
  - Parameter: `scenario` ($3k net, $4k net, etc.)
- **feedback_click** - When user clicks the feedback email link

### What Does NOT Get Tracked
- Salary amounts (entered or calculated)
- Net/gross compensation values
- Hourly rates
- Recruiter message text
- Any personally identifiable information (PII)

All tracking is anonymized with IP anonymization enabled.

## 6. Privacy & Compliance

The implementation includes:
- ✅ IP anonymization enabled
- ✅ No personalization signals sent
- ✅ No sensitive data (salaries, messages) tracked
- ✅ Only interaction metadata (mode, currency, language, scenario names)

For GDPR/CCPA compliance, consider:
- Adding a cookie consent banner
- Updating your Privacy Policy to mention GA4
- Allowing users to opt-out of analytics

## 7. Disable Analytics

To disable GA4 analytics:
1. Don't set `VITE_GA_MEASUREMENT_ID` in your environment
2. The app will run normally with analytics disabled
3. Check the console for: `[Analytics] GA4 disabled - VITE_GA_MEASUREMENT_ID not set`

## 8. Troubleshooting

### Events Not Appearing in Real-time
- Wait 24-48 hours for GA4 to process events (first time only)
- Use GA4 DebugView to see real-time data
- Check browser console for error messages
- Verify Measurement ID is correct in `.env.local`

### Measurement ID Not Loading
1. Check that `.env.local` exists in project root
2. Verify format: `VITE_GA_MEASUREMENT_ID=G_XXXXXXXXXX`
3. Restart dev server after changing `.env.local`
4. Check console: should show `GA4 initialized with measurement ID`

### GA Script Not Loading
- Open DevTools → Network tab
- Look for request to `googletagmanager.com`
- If missing, check that Measurement ID is set
- Check browser console for errors

## 9. Useful Resources

- [GA4 Setup Guide](https://support.google.com/analytics/answer/9304153)
- [GA4 Event Reference](https://support.google.com/analytics/answer/9322688)
- [GA4 Debugger Extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcicaksnog4gcopjco)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-modes.html)
