# Analytics Configuration Guide

Your website now supports Google Analytics 4, Facebook Pixel, and Google Search Console verification.

## What Was Added

### 1. Sanity Schema Updates
Updated [packages/admin/schemaTypes/documents/profile.ts](packages/admin/schemaTypes/documents/profile.ts) with three tracking fields in the Settings group:

- **Google Analytics 4 Measurement ID** (`googleID`)
  - Format: `G-XXXXXXXXXX`
  - Get yours from: https://analytics.google.com/

- **Facebook Pixel ID** (`facebookPixel`)
  - Format: Numeric ID (e.g., `1234567890`)
  - Get yours from: https://business.facebook.com/events_manager

- **Google Search Console Verification** (`googleSearchConsole`)
  - The verification code from your GSC meta tag
  - Get yours from: https://search.google.com/search-console

### 2. Analytics Component
Created [packages/web/src/components/Analytics.tsx](packages/web/src/components/Analytics.tsx):
- Loads Google Analytics 4 script with `afterInteractive` strategy
- Loads Facebook Pixel tracking code
- Only renders scripts when IDs are provided
- Uses Next.js Script component for optimal performance

### 3. Layout Integration
Updated [packages/web/src/app/layout.tsx](packages/web/src/app/layout.tsx):
- Added Analytics component to body
- Added Google Search Console verification to metadata
- Tracking scripts load conditionally based on Sanity settings

## How to Set Up

### Step 1: Add Your Tracking IDs in Sanity Studio

1. Open your Sanity Studio (typically at `http://localhost:3333`)
2. Navigate to **Profile** document
3. Go to the **Settings** tab
4. Fill in your tracking IDs:
   - **Google Analytics 4 Measurement ID**: Your GA4 ID (starts with `G-`)
   - **Facebook Pixel ID**: Your numeric Pixel ID
   - **Google Search Console Verification Code**: The verification code only (not the full meta tag)

### Step 2: Get Your Tracking IDs

#### Google Analytics 4
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property or select an existing one
3. Go to **Admin** → **Data Streams** → Select your web stream
4. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

#### Facebook Pixel
1. Go to [Meta Events Manager](https://business.facebook.com/events_manager)
2. Select your Pixel or create a new one
3. Copy your **Pixel ID** (numeric ID in the top left)

#### Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property (if not already added)
3. Select **HTML tag** verification method
4. Copy ONLY the content value from the meta tag
   - Example meta tag: `<meta name="google-site-verification" content="abc123xyz..." />`
   - Copy only: `abc123xyz...`

### Step 3: Publish & Deploy

1. **Save your Profile document** in Sanity Studio
2. **Deploy your website** to production
3. Verify tracking is working:
   - **GA4**: Check Real-time reports in Google Analytics
   - **Facebook Pixel**: Use the [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/) Chrome extension
   - **Search Console**: Click "Verify" in Google Search Console

## Implementation Details

### Script Loading Strategy
- Uses Next.js `Script` component with `strategy="afterInteractive"`
- Scripts load after page becomes interactive (optimal performance)
- No impact on initial page load or Core Web Vitals

### Privacy & Performance
- Scripts only load when IDs are configured (no unnecessary requests)
- Google Search Console uses metadata (no external scripts)
- All tracking respects user consent (implement cookie banner separately if needed)

### Testing

#### Check if scripts are loading:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Look for:
   - `gtag/js?id=G-XXXXXXXXXX` (Google Analytics)
   - `fbevents.js` (Facebook Pixel)

#### Verify Google Search Console:
View page source and look for:
```html
<meta name="google-site-verification" content="your-code-here" />
```

## Troubleshooting

### Analytics not tracking
- Verify IDs are saved in Sanity Profile document
- Check browser console for JavaScript errors
- Ensure ad blockers are disabled for testing
- Wait 24-48 hours for data to appear in GA4

### Facebook Pixel not firing
- Use Meta Pixel Helper to debug
- Check that Pixel ID is numeric (no spaces or special characters)
- Verify Pixel is active in Events Manager

### Search Console verification failing
- Ensure you copied ONLY the content value (not the full meta tag)
- Try the TXT record method as an alternative
- Wait a few minutes after deployment before clicking "Verify"

## Environment Variables (Optional)

If you prefer to use environment variables instead of Sanity fields:

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FB_PIXEL=1234567890
NEXT_PUBLIC_GSC_VERIFICATION=abc123xyz
```

Then update the Analytics component to use `process.env.NEXT_PUBLIC_GA_ID || googleID`
