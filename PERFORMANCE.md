# Performance Monitoring & Optimization

## 📊 Metrics We Track

### Core Web Vitals
- **LCP (Largest Contentful Paint)** - Should be < 2.5s
- **FID (First Input Delay)** - Should be < 100ms  
- **CLS (Cumulative Layout Shift)** - Should be < 0.1
- **TTFB (Time to First Byte)** - Should be < 600ms
- **FCP (First Contentful Paint)** - Should be < 1.8s

## 🔍 How to Measure Performance

### 1. Real-Time Monitoring (Development)
Web Vitals are automatically logged to console during development:
```bash
cd packages/web
pnpm dev
# Open browser, check console for [Web Vitals] logs
```

### 2. Bundle Analysis
See what's making your JavaScript bundles large:
```bash
cd packages/web
pnpm analyze
# Opens interactive bundle visualization in browser
```

### 3. Lighthouse (Production Build)
```bash
cd packages/web
pnpm build
pnpm start
# Open Chrome DevTools > Lighthouse > Run Analysis
```

### 4. Next.js Build Analysis
Look for build output metrics:
```bash
pnpm build

# Shows:
# Route                    Size      First Load JS
# ┌ ○ /                    1.2 kB     100 kB
# └ ○ /blog               2.1 kB     101 kB
```

## ⚡ Current Optimizations

### Caching Strategy
- **CDN Caching**: Enabled via Sanity CDN
- **Revalidation**: 1 hour (3600s) default
- **On-Demand**: Webhook triggers instant updates
- **Cache Tags**: Granular invalidation per content type

### Expected Performance

#### Before Optimizations:
- TTFB: 400-800ms (API calls on every request)
- LCP: 2-4s
- Cache Hit Rate: ~0%

#### After Optimizations:
- TTFB: 50-150ms (served from cache)
- LCP: 0.8-1.5s  
- Cache Hit Rate: 95%+
- API Calls: -90% (only on revalidation)

## 🎯 Performance Targets

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| LCP | < 2.5s | Check Lighthouse | - |
| FID | < 100ms | Check Lighthouse | - |
| CLS | < 0.1 | Check Lighthouse | - |
| TTFB | < 600ms | Check Network tab | - |
| Bundle Size | < 200kB | Run `pnpm analyze` | - |

## 🧪 Testing Procedure

### Initial Benchmark (Before)
1. Clear all caches: `rm -rf .next`
2. Build production: `pnpm build`
3. Start server: `pnpm start`
4. Open Lighthouse in Chrome DevTools
5. Run test in Incognito mode
6. Record all metrics

### After Optimization
1. Deploy changes
2. Clear browser cache
3. Wait 5 minutes (for caches to warm up)
4. Run Lighthouse again
5. Compare metrics

### Network Analysis
Open DevTools > Network tab and check:
- **Cold Load** (first visit): Should see API calls
- **Warm Load** (refresh): Should load from cache instantly
- **After Content Update**: Webhook triggers revalidation

## 📈 Monitoring in Production

### Option 1: Vercel Analytics (Recommended)
```bash
pnpm add @vercel/analytics
```

### Option 2: Google Analytics 4
Already configured via Analytics component

### Option 3: Custom Dashboard
Web Vitals are sent to `/api/vitals` - pipe to your analytics service

## 🚀 Additional Optimizations

### Already Implemented ✅
- [x] CDN caching enabled
- [x] On-demand revalidation webhook
- [x] Cache tags for granular control
- [x] Web Vitals tracking
- [x] Bundle analyzer
- [x] Image optimization (AVIF, WebP)
- [x] Security headers

### Next Steps 🎯
- [ ] Dynamic imports for page builder sections
- [ ] Loading.tsx files for better UX
- [ ] Edge runtime for API routes
- [ ] Remove duplicate pnpm-lock.yaml
- [ ] Optimize font loading
- [ ] Add more static generation paths

## 🔗 Useful Commands

```bash
# Analyze bundle size
pnpm analyze

# Build with performance metrics
pnpm build

# Start production server
pnpm start

# Run in development with vitals logging
pnpm dev
```

## 📚 Resources

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/)
- [Sanity CDN](https://www.sanity.io/docs/api-cdn)
