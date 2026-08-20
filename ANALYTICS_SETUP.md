# Google Analytics 4 Setup Guide

GA4 is already configured with Measurement ID `G-34V1FPP58R` in `index.html`.

## Quick Start

The GA4 script is automatically loaded. Just use the app and events will be tracked.

### Verify GA4 is Working

1. Open DevTools → Network tab
2. Look for requests to `googletagmanager.com` (should see `gtag/js`)
3. Or go to Google Analytics → Reports → Real-time to see events

## View Events in Real-time

**Note:** GA4 normally has a 24-48 hour delay. Use **DebugView** for instant events:

1. Go to Google Analytics → Admin → Property settings
2. Scroll to **Logging Settings** → toggle **Debug view** ON
3. Install [Google Analytics Debugger Extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcicaksnog4gcopjco)
4. Reload your app
5. Go to GA → Admin → Debug view
6. Use the calculator - events appear instantly

## Privacy & Data

✅ No salary amounts tracked
✅ No PII tracked  
✅ Only interaction metadata (mode, currency, language, scenario names)
✅ IP anonymization enabled

See `GA_EVENTS.md` for complete event documentation.
