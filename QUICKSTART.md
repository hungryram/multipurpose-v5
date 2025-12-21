# Quick Start Guide - Multipurpose V5

## ✅ Phase 1 Complete: Foundation

Your V5 template is now set up with:

### ✨ What's Working

1. **Sanity Studio v5** (http://localhost:3333)
   - ✅ Profile & Appearance settings
   - ✅ Navigation with submenus
   - ✅ Home & Pages with page builder
   - ✅ Blog with authors & categories
   - ✅ Services & Team management
   - ✅ SEO fields on all content types
   - ✅ Color picker plugin installed

2. **Next.js 16 Website** (http://localhost:3000)
   - ✅ Dynamic Header with navigation from CMS
   - ✅ Dynamic Footer with contact info
   - ✅ Page Builder with Hero, Content, CTA sections
   - ✅ Optimized images with Sanity CDN
   - ✅ SEO: Sitemap, Robots.txt, Structured Data
   - ✅ TypeScript throughout

3. **Performance Optimizations**
   - ✅ Next.js 16 with React 19
   - ✅ Tailwind CSS v4
   - ✅ LQIP image placeholders
   - ✅ Streaming SSR
   - ✅ Optimized GROQ queries

## 🚀 Next Steps

### Create Your First Content

1. **Open Sanity Studio**: http://localhost:3333

2. **Create Profile** (Required)
   - Go to "Profile" document type
   - Add company name, contact info, social media
   - Add website URL in settings
   - Save & Publish

3. **Set Up Appearance** (Required)
   - Go to "Appearance"
   - Upload logo
   - Set brand colors
   - Configure header/footer colors
   - Save & Publish

4. **Create Navigation** (Required)
   - Go to "Navigation"
   - Create your main menu
   - Add links (internal pages, paths, or external URLs)
   - Add submenus if needed
   - Save & Publish
   - Go back to "Appearance" → Header → Select your navigation
   - Save & Publish

5. **Create Home Page**
   - Go to "Home Page"
   - Add page builder sections:
     - Hero: Add heading, image, buttons
     - Content: Add text and images
     - CTA: Add call-to-action
   - Add SEO metadata
   - Save & Publish

6. **View Your Site**: http://localhost:3000

### Adding More Content

#### Create a Blog Post
```
1. Create an Author first
2. Create Categories
3. Create Post:
   - Add title, slug
   - Add featured image
   - Select author & categories
   - Write content
   - Add SEO metadata
   - Publish
```

#### Create a Service
```
1. Go to "Services"
2. Add title, slug
3. Add short description (excerpt)
4. Add featured image
5. Write detailed body content
6. Add SEO metadata
7. Publish
```

#### Create Custom Pages
```
1. Go to "Pages"
2. Add title & slug (e.g., "about")
3. Build page with sections
4. Add SEO metadata
5. Publish
6. Access at: /about
```

## 📝 Content Architecture

### Document Types

| Type | Purpose | URL Pattern |
|------|---------|-------------|
| Profile | Site settings | N/A (Global) |
| Appearance | Branding & colors | N/A (Global) |
| Navigation | Menu structure | N/A (Global) |
| Home | Homepage | `/` |
| Page | Custom pages | `/{slug}` |
| Post | Blog posts | `/blog/{slug}` |
| Service | Service pages | `/services/{slug}` |
| Team | Team members | Display only |
| Author | Blog authors | N/A (Reference) |
| Category | Blog categories | N/A (Reference) |

### Page Builder Blocks

| Block | Use For |
|-------|---------|
| **Hero** | Full-width headers with image/video backgrounds |
| **Content** | Text + image layouts (left/right/top/bottom) |
| **CTA** | Call-to-action sections with buttons |

*More blocks coming in Phase 2!*

## 🔧 Development

### Terminal Commands

**Admin (Sanity):**
```bash
cd packages/admin
pnpm dev        # Start Studio
pnpm build      # Build for production
pnpm deploy     # Deploy to Sanity hosting
```

**Web (Next.js):**
```bash
cd packages/web
pnpm dev        # Start dev server
pnpm build      # Build for production
pnpm start      # Start production server
```

### Environment Variables

Create `packages/web/.env.local`:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=v5zn3nrf
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🎯 Phase 2 Roadmap

### Additional Page Builder Blocks
- [ ] Testimonials section
- [ ] Team showcase
- [ ] Services grid
- [ ] Blog posts grid
- [ ] Image gallery
- [ ] Contact form
- [ ] FAQ/Accordion
- [ ] Stats/Numbers
- [ ] Logos/Partners

### Enhanced Features
- [ ] Dynamic OG image generation
- [ ] Blog pagination
- [ ] Category pages
- [ ] Search functionality
- [ ] Related posts
- [ ] Newsletter signup
- [ ] Analytics integration

### Performance
- [ ] Partial Prerendering (PPR)
- [ ] React Server Components optimization
- [ ] Bundle size analysis
- [ ] Core Web Vitals monitoring

## 📚 Key Files Reference

### Sanity Schemas
```
packages/admin/schemaTypes/
├── documents/        # Main content types
├── objects/         # Reusable components (SEO, buttons)
└── pagebuilder/     # Page builder blocks
```

### Next.js Components
```
packages/web/src/
├── app/
│   ├── layout.tsx      # Root layout with Header/Footer
│   ├── page.tsx        # Homepage
│   ├── sitemap.ts      # Auto-generated sitemap
│   └── robots.ts       # SEO robots file
├── components/
│   ├── Header.tsx      # Dynamic navigation
│   ├── Footer.tsx      # Dynamic footer
│   ├── Button.tsx      # CTA button component
│   ├── PageBuilder.tsx # Page builder router
│   └── sections/       # Section components
└── lib/
    ├── sanity/         # Sanity client & queries
    ├── utils.ts        # Helper functions
    └── structured-data.ts  # SEO schema
```

## 💡 Tips

1. **Always publish content** - Drafts won't show on the website
2. **Use SEO fields** - Fill out meta titles/descriptions
3. **Optimize images** - Sanity CDN handles this automatically
4. **Test navigation** - After creating pages, link them in navigation
5. **Check sitemap** - Visit `/sitemap.xml` to verify
6. **Use page builder** - Build layouts visually in Studio

## 🐛 Troubleshooting

**Issue**: Website shows "Create Home Page"
- **Fix**: Create and publish a Home Page document in Studio

**Issue**: Navigation not showing
- **Fix**: 
  1. Create Navigation document
  2. Add menu items
  3. Go to Appearance → Header → Select navigation
  4. Publish both documents

**Issue**: Images not loading
- **Fix**: Check environment variables are set correctly

**Issue**: Studio won't start
- **Fix**: Run `pnpm install` again in packages/admin

## 🎉 You're Ready!

Start creating content in Sanity Studio and watch it appear live on your Next.js site!

**Studio**: http://localhost:3333  
**Website**: http://localhost:3000

---

Questions? Check the main README.md for detailed documentation.
