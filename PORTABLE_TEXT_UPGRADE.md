# Portable Text Upgrade for Page Builders

## Overview
All 10 page builder blocks have been upgraded from simple text fields to rich portable text editors, giving content editors full formatting capabilities across the entire site.

## What Changed

### Schema Updates (Admin Package)
All page builder schemas now use `content` (portable text array) instead of separate `heading` and `text`/`subheading`/`tagline`/`body` fields:

**Updated Schemas:**
1. ✅ **ctaSection.ts** - `heading` + `text` → `content`
2. ✅ **hero.ts** - `heading` + `tagline` → `content`
3. ✅ **content.ts** - `heading` + `body` → `content`
4. ✅ **testimonials.ts** - `heading` + `subheading` → `content`
5. ✅ **teamSection.ts** - `heading` + `subheading` → `content`
6. ✅ **servicesSection.ts** - `heading` + `subheading` → `content`
7. ✅ **blogSection.ts** - `heading` + `subheading` → `content`
8. ✅ **gallery.ts** - `heading` + `subheading` → `content`
9. ✅ **faq.ts** - `heading` + `subheading` → `content`
10. ✅ **contactForm.ts** - `heading` + `subheading` → `content`

**Preview Functions Updated:**
All schema previews now extract the first block's text from the `content` array for display in the Sanity Studio interface.

### Component Updates (Web Package)
All React components now use `PortableTextBlock` for rich text rendering:

**Updated Components:**
1. ✅ **CTASection.tsx** - Uses portable text with large heading styles
2. ✅ **Hero.tsx** - Uses portable text with extra-large hero typography
3. ✅ **Content.tsx** - Uses portable text with prose styling
4. ✅ **Testimonials.tsx** - Uses portable text for section intros
5. ✅ **TeamSection.tsx** - Uses portable text for section headers
6. ✅ **ServicesSection.tsx** - Uses portable text for section headers
7. ✅ **BlogSection.tsx** - Uses portable text for section headers
8. ✅ **Gallery.tsx** - Uses portable text for section headers
9. ✅ **FAQ.tsx** - Uses portable text for section headers
10. ✅ **ContactForm.tsx** - Uses portable text for both layouts

**Styling Approach:**
Each component applies custom Tailwind classes to make the first block (typically the heading) larger and bolder:
```tsx
className="prose prose-lg max-w-none [&>*:first-child]:text-3xl [&>*:first-child]:font-bold md:[&>*:first-child]:text-4xl"
```

### Query Updates
**Files Modified:**
- ✅ **queries.ts** - Updated `homePageQuery` and `pageQuery` to fetch `content` instead of individual text fields

## Rich Text Capabilities

Content editors now have access to:
- **Headings** (H1-H6)
- **Paragraphs** with spacing
- **Bold** and *italic* text
- **Links** (internal and external)
- **Bullet lists** and numbered lists
- **Blockquotes**
- **Code blocks**
- **Images** with captions
- And all other portable text features

## Content Migration Notes

### For Existing Content
Content editors will need to:
1. Open each page in Sanity Studio
2. Click into each page builder block
3. Re-enter content using the new rich text editor
4. Save and publish changes

### Migration Strategy
The old fields (`heading`, `text`, `subheading`, etc.) no longer exist in the schema, so:
- **New blocks** will have the rich text editor by default
- **Existing blocks** will show empty until content is re-entered
- Consider this an opportunity to improve content with better formatting

### Recommended Content Structure
For each block's `content` field:
1. **First block should be a heading** (H2 or H3) - this displays in Studio previews
2. **Follow with paragraphs** for body text
3. **Use formatting** (bold, lists, links) as needed

Example structure:
```
## Section Heading [This becomes the preview title]

This is the body text with **bold** and *italic* formatting.

- Bullet point one
- Bullet point two
```

## Benefits

### For Content Editors
✅ Full rich text formatting without leaving Sanity
✅ Consistent editing experience across all page builders
✅ Ability to add emphasis, lists, and links anywhere
✅ Better content structure with proper headings

### For Developers
✅ Single reusable portable text component
✅ Consistent styling through PortableTextBlock
✅ Cleaner schema definitions
✅ Easier to maintain and extend

### For End Users
✅ Better formatted content
✅ More semantic HTML
✅ Improved accessibility with proper heading hierarchy
✅ Enhanced SEO with structured content

## Component Architecture

**Reusable Component:**
- `PortableTextBlock.tsx` - Wrapper that uses `PortableTextComponents.tsx` for consistent rendering
- All page builder sections now import and use this component
- Custom Tailwind classes can be passed to style the wrapper

**Styling Strategy:**
Each section applies appropriate sizing:
- Hero sections: Extra large (text-4xl to text-7xl)
- CTA sections: Large (text-3xl to text-5xl)
- Content sections: Standard prose (text-3xl to text-4xl)
- Header sections: Medium-large (text-3xl to text-4xl)

## Testing Checklist

Before deploying to production:
- [ ] Open Sanity Studio and verify all page builder blocks show the content editor
- [ ] Create test content with headings, paragraphs, bold, italic, lists, and links
- [ ] Preview pages to verify formatting appears correctly
- [ ] Check mobile responsive behavior
- [ ] Test all 10 page builder block types
- [ ] Verify schema previews show correct titles
- [ ] Confirm old content is migrated or re-entered

## Files Modified

### Admin Package (Schemas)
```
packages/admin/schemaTypes/pagebuilder/
├── ctaSection.ts          [UPDATED]
├── hero.ts                [UPDATED]
├── content.ts             [UPDATED]
├── testimonials.ts        [UPDATED]
├── teamSection.ts         [UPDATED]
├── servicesSection.ts     [UPDATED]
├── blogSection.ts         [UPDATED]
├── gallery.ts             [UPDATED]
├── faq.ts                 [UPDATED]
└── contactForm.ts         [UPDATED]
```

### Web Package (Components)
```
packages/web/src/
├── components/
│   ├── PortableTextBlock.tsx           [MODIFIED - Changed to default export]
│   └── sections/
│       ├── CTASection.tsx              [UPDATED]
│       ├── Hero.tsx                    [UPDATED]
│       ├── Content.tsx                 [UPDATED]
│       ├── Testimonials.tsx            [UPDATED]
│       ├── TeamSection.tsx             [UPDATED]
│       ├── ServicesSection.tsx         [UPDATED]
│       ├── BlogSection.tsx             [UPDATED]
│       ├── Gallery.tsx                 [UPDATED]
│       ├── FAQ.tsx                     [UPDATED]
│       └── ContactForm.tsx             [UPDATED]
├── lib/sanity/
│   └── queries.ts                      [UPDATED]
└── app/blog/[slug]/
    └── page.tsx                        [UPDATED - Import fix]
```

## Next Steps

1. **Redeploy Sanity Studio** - Run `pnpm --filter admin deploy` to push schema changes
2. **Test in Studio** - Open Sanity Studio and verify the content editor works
3. **Migrate Content** - Re-enter content for existing pages/blocks
4. **Deploy Web** - Deploy the web package with updated components
5. **QA Testing** - Verify all page builder blocks render correctly

## Support

The portable text editor supports the same rich text features used in blog posts. Editors familiar with the blog editor will immediately understand how to use the page builder content fields.

---

**Upgrade Complete** ✅  
All 10 page builder blocks now support full rich text editing!
