# Multipurpose V5

A production-ready, high-performance multipurpose website template built with Next.js 16, Sanity v5, and Tailwind CSS v4. Designed to be the ultimate starter for client projects with enterprise-grade performance, security, and SEO out of the box.

## 🚀 Quick Deploy

### 1. Create Sanity Project

First, create a new Sanity project at [sanity.io/manage](https://www.sanity.io/manage/personal/projects)
- Name your project
- Create a dataset called: `production`

### 2. Deploy the Website

[![Deploy Website with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhungryram%2Fmultipurpose-v5&project-name=multipurpose-v5&repository-name=multipurpose-v5&root-directory=packages/web&env=NEXT_PUBLIC_SANITY_PROJECT_ID,NEXT_PUBLIC_SANITY_DATASET,SANITY_API_READ_TOKEN,NEXT_PUBLIC_SITE_URL&envDescription=Required%20environment%20variables%20for%20Sanity%20integration&envLink=https%3A%2F%2Fgithub.com%2Fhungryram%2Fmultipurpose-v5%23environment-variables)

**Required Environment Variables:**
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Your Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` - `production`
- `SANITY_API_READ_TOKEN` - Create in [Sanity Manage](https://www.sanity.io/manage) → API → Tokens
- `NEXT_PUBLIC_SITE_URL` - Your deployed URL (e.g., `https://yoursite.com`)

**Optional Environment Variables:**
- `POSTMARK_API_KEY` - For contact form emails ([Get API key](https://postmarkapp.com/))
- `SHEETS_CLIENT_EMAIL` - For Google Sheets integration (see [Setup Guide](./GOOGLE_SHEETS_SETUP.md))
- `SHEETS_PRIVATE_KEY` - For Google Sheets integration
- `SANITY_WEBHOOK_SECRET` - For on-demand revalidation (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

### 3. Deploy the Studio (Admin)

[![Deploy Studio with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhungryram%2Fmultipurpose-v5&project-name=multipurpose-v5-studio&repository-name=multipurpose-v5-studio&root-directory=packages/admin&framework=sanity&env=SANITY_STUDIO_PROJECT_ID,SANITY_STUDIO_DATASET&envDescription=Sanity%20project%20configuration&envLink=https%3A%2F%2Fgithub.com%2Fhungryram%2Fmultipurpose-v5%23environment-variables)

**Required Environment Variables:**
- `SANITY_STUDIO_PROJECT_ID` - Your Sanity project ID (same as website)
- `SANITY_STUDIO_DATASET` - `production`

The Studio will be deployed and accessible at your Vercel URL (e.g., `https://your-studio.vercel.app`)

### 4. Configure CORS in Sanity

After deploying both the website and studio:

1. Go to [Sanity Manage](https://www.sanity.io/manage) → Your Project → API → CORS Origins
2. Add your deployed URLs:
   - `https://your-website.vercel.app`
   - `https://your-studio.vercel.app`
3. Set credentials to: **Include credentials**

### 5. Link Local Environment (Optional)

If you want to develop locally:

```bash
# Clone the repository
git clone https://github.com/hungryram/multipurpose-v5
cd multipurpose-v5

# Install dependencies
pnpm install

# Link to Vercel project for web
cd packages/web
npx vercel link
npx vercel env pull

# Link to Vercel project for admin
cd ../admin
npx vercel link
npx vercel env pull

# Run locally
cd ../..
pnpm dev
```

---

## ✨ Key Improvements Over V4

### Performance
- ⚡ **50% Faster Queries** - Optimized GROQ queries with precise projections
- 🖼️ **Modern Image Formats** - AVIF & WebP with LQIP placeholders
- 🔄 **ISR Enabled** - Incremental Static Regeneration (60s homepage, 300s blog)
- 📦 **Optimized Bundles** - Automatic package imports optimization
- 🎯 **React 19** - Latest performance improvements and React Compiler ready

### Security
- 🔒 **Security Headers** - CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- 🛡️ **Content Security Policy** - Strict CSP with proper directives for scripts, styles, and images
- 🔐 **Input Validation** - Form validation with proper sanitization
- 🚫 **XSS Protection** - Built-in protection against common attacks

### SEO
- 📊 **Structured Data** - Organization, LocalBusiness, Article, FAQ, Breadcrumb schemas
- 🗺️ **Dynamic Sitemap** - Auto-generated from all content types (pages, posts, services, categories)
- 🤖 **Robots.txt** - Proper crawl rules for search engines
- 📱 **Open Graph** - Complete OG and Twitter Card metadata
- 🔍 **Rich Snippets** - FAQ, Article, and Breadcrumb markup

### Content Management
- 🎨 **10 Page Builder Blocks** - Hero, Content, CTA, Testimonials, Team, Services, Blog, Gallery, FAQ, Contact Form
- 📝 **Organized Studio** - Singletons (Profile, Appearance, Blog Index) + tab groups
- 🏠 **Multiple Home Pages** - Create multiple home page variants, select active one in Appearance
- 🔄 **Media Library** - Integrated Sanity Media Plugin for asset management
- 🏷️ **Better Categorization** - Improved content organization with references

### Developer Experience
- 📱 **Mobile-First Navigation** - Responsive header with hamburger menu
- 🎨 **Portable Text Components** - Reusable rich text rendering with custom styling
- 📧 **Postmark Integration** - Email sending ready for contact forms
- 🚨 **Custom Error Pages** - Branded 404 and 500 error pages
- 🔗 **Smart Link Handling** - Automatic routing for home, blog index, and content types

## 📦 Project Structure

```
multipurpose-v5/
├── packages/
│   ├── admin/           # Sanity Studio v5
│   │   ├── schemaTypes/
│   │   │   ├── documents/    # 11 content types (including blogIndex)
│   │   │   ├── objects/      # Reusable objects (SEO, Button)
│   │   │   └── pagebuilder/  # 10 page builder blocks
│   │   └── sanity.config.ts
│   │
│   └── web/             # Next.js 16 frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── blog/     # Dynamic blog routing with pagination
│       │   │   ├── api/      # API routes (Postmark contact form)
│       │   │   ├── not-found.tsx  # Custom 404
│       │   │   ├── error.tsx      # Custom 500
│       │   │   ├── sitemap.ts
│       │   │   └── robots.ts
│       │   ├── components/
│       │   │   ├── sections/  # 10 page builder components
│       │   │   ├── Header.tsx
│       │   │   ├── Footer.tsx
│       │   │   ├── Button.tsx
│       │   │   └── PageBuilder.tsx
│       │   └── lib/
│       │       ├── sanity/    # Optimized client & queries
│       │       ├── structured-data.ts
│       │       └── utils.ts
│       └── next.config.ts  # With security headers
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 22+
- pnpm 10+

1. **Clone and install dependencies:**

\`\`\`bash
pnpm install
\`\`\`

2. **Set up environment variables:**

Create \`.env.local\` in \`packages/web/\`:

\`\`\`env
NEXT_PUBLIC_SANITY_PROJECT_ID=v5zn3nrf
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

3. **Start Sanity Studio:**

\`\`\`bash
cd packages/admin
pnpm dev
\`\`\`

Studio will be available at http://localhost:3333

4. **Start Next.js development server:**

\`\`\`bash
cd packages/web
pnpm dev
\`\`\`

Website will be available at http://localhost:3000

## 📝 Content Types

### Documents

- **Profile** - Company information, contact details, social media
- **Appearance** - Branding, colors, header/footer settings
- **Navigation** - Menu structure with nested submenus
- **Home** - Homepage with page builder
- **Page** - Custom pages with page builder
- **Post** - Blog posts with categories and authors
- **Service** - Service offerings
- **Team** - Team members
- **Author** - Blog post authors
- **Category** - Blog categories

### Page Builder Blocks

- **Hero** - Full-width hero sections with images and CTAs
- **Content** - Flexible content sections with rich text and images
- **CTA Section** - Call-to-action sections with buttons
- **Testimonials** - Customer testimonials with ratings and avatars
- **Team Section** - Team member showcases with social links
- **Services Section** - Service offerings with images and links
- **Blog Section** - Dynamic blog post displays with filtering
- **Gallery** - Image galleries with lightbox support
- **FAQ** - Accordion-style frequently asked questions
- **Contact Form** - Customizable contact forms with validation

## 🎨 Customization

### Adding New Page Builder Blocks

1. **Create schema in admin:**

\`\`\`typescript
// packages/admin/schemaTypes/pagebuilder/yourBlock.ts
import {defineType} from 'sanity'

export default defineType({
  name: 'yourBlock',
  title: 'Your Block',
  type: 'object',
  fields: [
    // Your fields
  ],
})
\`\`\`

2. **Create component in web:**

\`\`\`typescript
// packages/web/src/components/sections/YourBlock.tsx
export default function YourBlock({ data }: { data: any }) {
  // Your component
}
\`\`\`

3. **Register in PageBuilder:**

\`\`\`typescript
// packages/web/src/components/PageBuilder.tsx
import YourBlock from './sections/YourBlock'

// Add to switch statement
case 'yourBlock':
  return <YourBlock key={section._key} data={section} />
\`\`\`

## 🚀 Deployment

### Deploy Sanity Studio

\`\`\`bash
cd packages/admin
pnpm build
pnpm deploy
\`\`\`

### Deploy Next.js (Vercel)

\`\`\`bash
cd packages/web
vercel
\`\`\`

## � Email Configuration (Postmark)

1. **Sign up for Postmark** at https://postmarkapp.com

2. **Create a Server** and get your Server API Token

3. **Verify your sender domain** in Postmark settings

4. **Add environment variables** to your .env.local:

\`\`\`env
POSTMARK_API_KEY=your_postmark_server_api_key
FROM_EMAIL=noreply@yourdomain.com
NOTIFICATION_EMAIL=your@email.com
\`\`\`

5. **Test the contact form** - submissions will now send emails via Postmark

## �📊 Performance Optimizations

- ✅ Image optimization with Sanity CDN
- ✅ LQIP (Low Quality Image Placeholders)
- ✅ Streaming SSR
- ✅ React 19 optimizations
- ✅ Tailwind CSS v4 (faster builds)
- ✅ Optimized GROQ queries
- ✅ Automatic sitemap generation
- ✅ Structured data for SEO

## 🔧 Available Scripts

### Admin (Sanity Studio)

- \`pnpm dev\` - Start development server
- \`pnpm build\` - Build for production
- \`pnpm deploy\` - Deploy studio

### Web (Next.js)

- \`pnpm dev\` - Start development server
- \`pnpm build\` - Build for production
- \`pnpm start\` - Start production server
- \`pnpm lint\` - Run ESLint

## 📚 Tech Stack

- **Framework**: Next.js 16
- **CMS**: Sanity Studio v5
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Image Optimization**: Sanity CDN + Next.js Image
- **Rich Text**: Portable Text

## 🆚 V4 vs V5

### Key Improvements

| Feature | V4 | V5 |
|---------|----|----|
| Next.js | 15 | **16 (latest)** |
| React | 18 | **19** |
| Sanity | 3 | **5** |
| Tailwind | 3 | **4** |
| Bundle Size | Large (Radix UI) | **Smaller (custom components)** |
| GROQ Queries | 1000+ lines | **Optimized & modular** |
| SEO | Basic | **Advanced (structured data, OG images)** |
| Performance | Good | **Excellent** |

## 📄 License

UNLICENSED - Private project

## 🤝 Contributing

This is a template project. Fork and customize for your needs!
