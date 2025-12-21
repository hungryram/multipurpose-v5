# Production Checklist

Use this checklist before launching client sites to ensure everything is production-ready.

## ✅ Sanity Studio Setup

- [ ] Created Profile document with company information
- [ ] Created Appearance document with branding (logo, colors, etc.)
- [ ] Created at least one Home Page document
- [ ] Selected active Home Page in Appearance → General
- [ ] Created Blog Index document
- [ ] Selected active Blog Index in Appearance → General
- [ ] Created and published main navigation
- [ ] Selected main navigation in Appearance → Header
- [ ] Uploaded logo and configured width in Appearance → Branding
- [ ] Configured brand colors in Appearance → Colors
- [ ] Added footer text in Appearance → Footer
- [ ] Created at least one blog post (if using blog)
- [ ] Created at least one category (if using blog)
- [ ] Deployed Studio to Sanity hosting: `pnpm deploy`

## ✅ Environment Variables

- [ ] Copied .env.local.example to .env.local
- [ ] Set NEXT_PUBLIC_SANITY_PROJECT_ID
- [ ] Set NEXT_PUBLIC_SANITY_DATASET
- [ ] Set NEXT_PUBLIC_SITE_URL (production URL)
- [ ] Set POSTMARK_API_KEY (if using contact form)
- [ ] Set FROM_EMAIL (verified sender in Postmark)
- [ ] Set NOTIFICATION_EMAIL (where form submissions go)
- [ ] Verified sender domain in Postmark

## ✅ Content & SEO

- [ ] Added meta titles and descriptions to all pages
- [ ] Added Open Graph images where needed
- [ ] Configured SEO settings for Home Page
- [ ] Configured SEO settings for Blog Index
- [ ] Added alt text to all images
- [ ] Created custom 404 page content (optional)
- [ ] Tested sitemap at /sitemap.xml
- [ ] Verified robots.txt at /robots.txt
- [ ] Configured noindex/nofollow for appropriate pages

## ✅ Testing

- [ ] Tested homepage loads correctly
- [ ] Tested all page builder sections render properly
- [ ] Tested blog index page
- [ ] Tested individual blog post pages
- [ ] Tested blog category pages
- [ ] Tested navigation (desktop and mobile)
- [ ] Tested contact form submission
- [ ] Verified email notifications work
- [ ] Tested on mobile devices
- [ ] Tested on different browsers
- [ ] Checked console for errors
- [ ] Tested 404 page
- [ ] Tested all internal links work
- [ ] Verified images load with proper alt text

## ✅ Performance

- [ ] Ran Lighthouse audit (target: 90+ on all metrics)
- [ ] Verified ISR revalidation working (check cache headers)
- [ ] Optimized all images (compressed, proper formats)
- [ ] Tested page load times (<3s on 4G)
- [ ] Verified no hydration errors in console

## ✅ Security

- [ ] Security headers configured (check /api/test-headers if needed)
- [ ] CSP not blocking necessary resources
- [ ] CORS configured in Sanity for production domain
- [ ] API keys not exposed in client-side code
- [ ] Form validation working properly

## ✅ Deployment

### Next.js (Vercel)
- [ ] Connected GitHub/GitLab repository
- [ ] Configured environment variables in Vercel
- [ ] Set production domain
- [ ] Enabled automatic deployments from main branch
- [ ] Tested production build locally: `pnpm build && pnpm start`
- [ ] Deployed to production
- [ ] Verified deployment successful

### Sanity Studio
- [ ] Deployed studio: `cd packages/admin && pnpm deploy`
- [ ] Verified studio accessible at deployed URL
- [ ] Added CORS origin for production frontend domain:
  ```bash
  sanity cors add https://yourdomain.com --credentials
  ```

## ✅ Post-Launch

- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Set up analytics (Google Analytics, Plausible, etc.)
- [ ] Configure monitoring (Sentry, LogRocket, etc.)
- [ ] Test contact form with real submission
- [ ] Verify email notifications arrive
- [ ] Test all pages on production URL
- [ ] Clear CDN cache if using Cloudflare/similar
- [ ] Update DNS if needed
- [ ] Enable HTTPS redirect
- [ ] Test canonical URLs are correct
- [ ] Monitor Core Web Vitals

## 📝 Client Handoff

- [ ] Provide Sanity Studio URL and login credentials
- [ ] Document how to publish content changes
- [ ] Explain page builder system
- [ ] Show how to manage navigation
- [ ] Demonstrate media library usage
- [ ] Provide support contact information
- [ ] Share analytics dashboard access
- [ ] Document any custom features or blocks

## 🔄 Maintenance

- [ ] Schedule regular security updates
- [ ] Monitor performance metrics
- [ ] Check for broken links monthly
- [ ] Review analytics quarterly
- [ ] Update content regularly
- [ ] Backup Sanity data (Sanity handles this, but export if needed)
- [ ] Test forms monthly
- [ ] Update dependencies quarterly

---

**Ready to launch? Double-check this list and deploy with confidence! 🚀**
