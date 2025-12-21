# Live Preview Setup

## What's Working
✅ Presentation tool added to Sanity Studio
✅ Draft mode API routes created
✅ Preview client configured with draft perspective

## Next Steps

### 1. Get a Read Token from Sanity
1. Go to https://sanity.io/manage
2. Select your project (v5zn3nrf)
3. Go to **API** tab → **Tokens**
4. Click **Add API token**
5. Name: "Preview Token"
6. Permissions: **Viewer** (read-only)
7. Copy the token

### 2. Update Environment Variables
In `packages/web/.env.local`:
```env
SANITY_API_READ_TOKEN=your-token-here
SANITY_PREVIEW_SECRET=your-secret-token-here
```

Change `your-secret-token-here` to any random string (used to secure the draft endpoint).

### 3. Restart Both Servers
```bash
# Terminal 1 - Sanity Studio
cd packages/admin
pnpm dev

# Terminal 2 - Next.js
cd packages/web
pnpm dev
```

### 4. Use Live Preview
1. Open Studio at http://localhost:3333
2. Click **Presentation** tab (new icon in top nav)
3. Edit any content and see live changes!

## Features

**Draft Mode:**
- Shows unpublished changes in real-time
- No need to publish to see updates
- Works for all content types

**Keyboard Shortcut:**
- Press `Ctrl+Shift+D` to exit draft mode

**Preview URLs:**
- Home: http://localhost:3000
- Pages: http://localhost:3000/[slug]
- Blog: http://localhost:3000/blog/[slug]
- Services: http://localhost:3000/services/[slug]

## Files Created
- `packages/web/src/app/api/draft/route.ts` - Enable draft mode
- `packages/web/src/app/api/disable-draft/route.ts` - Disable draft mode
- `packages/web/src/lib/sanity/getClient.ts` - Smart client switcher
- `packages/web/src/components/DraftModeToggle.tsx` - Keyboard shortcut component

## Files Modified
- `packages/admin/sanity.config.ts` - Added presentation tool
- `packages/web/src/lib/sanity/client.ts` - Added stega encoding
- `packages/web/.env.local` - Added preview secrets
