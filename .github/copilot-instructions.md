# Multipurpose V5 - AI Coding Agent Instructions

## Project Architecture

**Monorepo Structure**: This is a PNPM workspace with two packages:
- `packages/admin/` - Sanity Studio v5 (CMS admin interface, runs on :3333)
- `packages/web/` - Next.js 16 frontend (public website, runs on :3000)

**Tech Stack**: Next.js 16 + React 19, Sanity v5, Tailwind CSS v4, TypeScript, pnpm

## Development Commands

```bash
# From root - Start both packages
pnpm dev

# Individual packages
cd packages/admin && pnpm dev  # Studio on localhost:3333
cd packages/web && pnpm dev    # Web on localhost:3000

# Deploy Studio to Sanity cloud
cd packages/admin && pnpm deploy

# Production build
cd packages/web && pnpm build && pnpm start
```

## Critical Conventions

### Content Management Pattern

**Singleton Documents**: Profile, Appearance, and Blog Index are singletons configured in `packages/admin/sanity.config.ts` with fixed IDs ('profile', 'appearance', 'blogIndex'). They use custom structure API to prevent duplication.

**Page Builder System**: All page types (home, page, blogIndex) use the same 13 page builder blocks defined in `schemaTypes/pagebuilder/`. Components are mapped in `PageBuilder.tsx` via a switch statement.

**Portable Text Everywhere**: All page builder blocks now use `content` (portable text array) instead of separate heading/text fields. See `PORTABLE_TEXT_UPGRADE.md` for migration details. Custom components are in `PortableTextComponents.tsx`.

### Data Fetching Architecture

**GROQ Queries**: All queries are centralized in `packages/web/src/lib/sanity/queries.ts` using groq template literals with reusable fragments:
```typescript
// Pattern: Define fragments once, compose into queries
export const imageFields = groq`asset-> { url, metadata { lqip, dimensions } }`
export const seoFields = groq`seo { metaTitle, metaDescription, ... }`
```

**ISR Configuration**: Homepage revalidates every 60s, blog posts every 300s (5 min). Set via `export const revalidate = 60` in page files.

**Client Setup**: Single client instance in `lib/sanity/client.ts` with `useCdn: true`, `perspective: 'published'`, API version `2024-12-18`.

### Routing & Link Handling

**Dynamic Routes**: 
- `[slug]/page.tsx` - Custom pages
- `blog/[slug]/page.tsx` - Blog posts with related posts
- `blog/category/[slug]/page.tsx` - Category archives with pagination
- `services/[slug]/page.tsx` - Service detail pages

**Smart Link Resolution** (Button.tsx pattern):
```typescript
// Internal links resolve based on _type:
// home → '/'
// blogIndex → '/blog'  
// page → '/page/[slug]'
// service → '/services/[slug]'
// post → '/blog/[slug]'
```

### Image Handling

**Pattern**: Always use LQIP (Low Quality Image Placeholder) from Sanity metadata:
```typescript
import {urlFor} from '@/lib/sanity/image'

<Image
  src={urlFor(image).width(800).url()}
  placeholder="blur"
  blurDataURL={image.asset.metadata?.lqip}
  alt={image.asset.altText || ''}
/>
```

**Formats**: Next.js configured for AVIF→WebP→JPEG fallback in `next.config.ts`.

### Styling Patterns

**Section Backgrounds**: Utility functions in `lib/utils/section.ts` handle section padding, container widths, backgrounds (solid/gradient/image). Applied in PageBuilder.tsx wrapper.

**Dynamic Theme Colors**: CSS variables injected in `layout.tsx` from Appearance settings (brand colors, header/footer colors). Example: `var(--primary-btn-bg)`.

**Tailwind Prose**: Used for portable text with custom first-child styling:
```tsx
className="prose prose-lg [&>*:first-child]:text-3xl [&>*:first-child]:font-bold"
```

## Schema Development

**Pattern**: Document types in `schemaTypes/documents/`, objects in `objects/`, page builders in `pagebuilder/`, fragments in `fragments/`. All use `defineType()` from Sanity.

**Preview Functions**: Extract text from portable text arrays for Studio list views:
```typescript
preview: {
  select: { content: 'content' },
  prepare({content}) {
    const block = (content || []).find((block: any) => block._type === 'block')
    return { title: block?.children?.[0]?.text || 'Untitled' }
  }
}
```

**Validation**: Required fields use `.validation((Rule) => Rule.required())`. Slugs source from title with `source: 'title'`.

## API & Forms

**Contact Form**: 
- POST to `/api/contact/route.ts`
- Email via Postmark (optional): Requires `POSTMARK_API_KEY` env var. Notification email configured in Sanity form settings or Profile
- Google Sheets integration (optional): Configure per-form in Sanity (Google Sheet ID + Tab Name) or globally via env vars. Requires `SHEETS_CLIENT_EMAIL` and `SHEETS_PRIVATE_KEY`. See `GOOGLE_SHEETS_SETUP.md`
- Redirect after submission: Configure in Sanity form settings with internal page reference, external URL, or custom path
- Field labels sent to API for proper email/sheet formatting (no cryptic IDs)

**Form Validation**: Uses react-hook-form + zod for client-side validation with dynamic schema generation. See ContactForm.tsx for pattern.

## SEO & Performance

**Metadata Pattern**: All pages export `generateMetadata()` async function fetching from Sanity. See `[slug]/page.tsx` for template.

**Structured Data**: Generated in `lib/structured-data.ts` (Organization, LocalBusiness, Article, FAQ, Breadcrumb). Injected in layout.tsx.

**Static Generation**: Pages export `generateStaticParams()` for ISR with fallback. Check `blog/[slug]/page.tsx` for example.

## Security

**Headers**: Configured in `next.config.ts` including CSP, HSTS, X-Frame-Options. CSP allows Sanity CDN for images/media.

**Environment Variables**: Required in `packages/web/.env.local`:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=v5zn3nrf
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Key Files Reference

- `packages/admin/sanity.config.ts` - Studio configuration & structure
- `packages/web/src/app/layout.tsx` - Root layout with theme variables
- `packages/web/src/components/PageBuilder.tsx` - Page builder orchestration
- `packages/web/src/lib/sanity/queries.ts` - All GROQ queries
- `packages/web/next.config.ts` - Security headers, image config
- `QUICKSTART.md` - Setup steps & content creation workflow
- `PRODUCTION_CHECKLIST.md` - Pre-launch checklist

## Common Pitfalls

1. **Don't hardcode Sanity project ID** - Use env vars even though 'v5zn3nrf' appears in config
2. **Don't forget revalidate exports** - Pages without ISR config will be fully static
3. **Always include LQIP** - Queries must fetch `metadata { lqip, dimensions }` for images
4. **Section Settings inheritance** - Page builder blocks use sectionSettings fragment pattern
5. **PNPM workspace context** - Run commands from correct package directory or use `pnpm --filter`
