# AI SEO Features Setup Guide

## Overview

This template includes optional AI-powered SEO features that can be enabled on a per-client basis:

1. **Smart Alt Text Generation** - AI analyzes images and generates descriptive alt text
2. **SEO Meta Generator** - AI analyzes page content and generates optimized meta titles & descriptions

## Cost Estimates

Using OpenAI GPT-4o-mini (cheapest vision model):
- **Alt text generation**: ~$0.01 - $0.02 per image
- **SEO meta generation**: ~$0.005 - $0.01 per page
- **Monthly estimate for active client**: $5-15/month depending on usage

## Setup Instructions

### 1. Get OpenAI API Key

1. Sign up at https://platform.openai.com/
2. Go to API Keys section
3. Create a new API key
4. Copy the key (starts with `sk-proj-...`)

### 2. Configure Environment Variables

Add these to your `.env.local` (for local development) and Vercel/hosting environment:

```bash
# Required - Your OpenAI API key
OPENAI_API_KEY=sk-proj-your-key-here

# Master switch - Controls if AI features are available at all
NEXT_PUBLIC_ENABLE_AI_FEATURES=true

# For Studio to reach your API routes
SANITY_STUDIO_WEBSITE_URL=http://localhost:3000  # Local
# SANITY_STUDIO_WEBSITE_URL=https://yourdomain.com  # Production

# Studio environment flag (must match frontend)
SANITY_STUDIO_ENABLE_AI_FEATURES=true
```

### 3. Per-Client Control

Even with AI enabled globally, you control it per-project in Sanity Studio:

1. Go to **Profile** document in Studio
2. Navigate to **Settings** tab
3. Toggle **"Enable AI SEO Tools"** on/off
4. This shows/hides the AI buttons for that specific client

### 4. Install Dependencies

```bash
cd packages/web
pnpm install
```

This installs the `openai` package added to package.json.

### 5. Deploy

When deploying to Vercel/production:

1. Add all environment variables in your hosting dashboard
2. Make sure `SANITY_STUDIO_WEBSITE_URL` points to your production domain
3. Redeploy Studio if environment variables changed

## How It Works

### For Clients Who Pay for SEO ($$$):

1. Set `NEXT_PUBLIC_ENABLE_AI_FEATURES=true` in environment
2. Enable "AI SEO Tools" in Profile > Settings
3. AI buttons appear throughout Studio:
   - **✨ Generate Alt Text with AI** - Next to image uploads
   - **✨ Generate SEO Meta from Content** - In SEO section

### For Clients Who Don't Pay:

1. Either don't set the environment variable, or
2. Keep "AI SEO Tools" toggle OFF in Profile > Settings
3. No AI buttons appear - they never know the feature exists
4. No API calls made, zero cost

## Usage for SEO Clients

### Generate Alt Text:
1. Upload an image in any field (blog post, page builder, logos, etc.)
2. Click **✨ Generate Alt Text with AI** button
3. AI analyzes the image and populates alt text
4. Edit if needed, then save

### Generate SEO Meta:
1. Create page content (title, body, page builder blocks)
2. Open SEO section
3. Click **✨ Generate SEO Meta from Content** button
4. AI reads all content and generates:
   - Optimized meta title (50-60 chars)
   - Optimized meta description (120-155 chars)
5. Review and edit if needed, then save

## Where AI Alt Text Appears

Currently integrated in:
- ✅ Blog post main images
- ✅ Appearance logo & scroll logo
- ✅ Appearance favicon

**To add to more images:**
Add this field configuration to any `type: 'image'`:

```typescript
{
  name: 'yourImage',
  type: 'image',
  fields: [
    {
      name: 'altText',
      title: 'Alt Text',
      type: 'string',
      components: {
        input: (props: any) => {
          const enableAI =
            process.env.SANITY_STUDIO_ENABLE_AI_FEATURES === 'true' &&
            process.env.NEXT_PUBLIC_ENABLE_AI_FEATURES === 'true'
          if (!enableAI) return props.renderDefault(props)
          const {AltTextGenerator} = require('../../components/AltTextGenerator')
          return AltTextGenerator(props)
        },
      },
    },
  ],
}
```

## Troubleshooting

### "AI features are not enabled" error
- Check `NEXT_PUBLIC_ENABLE_AI_FEATURES=true` in environment
- Restart dev server after adding env vars

### "OpenAI API key not configured" error
- Check `OPENAI_API_KEY` in environment
- Make sure it starts with `sk-proj-` (new format) or `sk-` (old format)

### AI buttons don't appear
- Check both environment variables are set
- Check Profile > Settings > "Enable AI SEO Tools" is ON
- Refresh Studio page

### "Failed to generate" errors
- Check browser console for specific error
- Verify OpenAI API key has credits
- Check if image URL is accessible (CORS issues)
- Ensure SANITY_STUDIO_WEBSITE_URL points to running server

## Cost Management Tips

1. **Use GPT-4o-mini** (already configured) - cheapest vision model
2. **Only enable for paying clients** - Keep toggle OFF otherwise
3. **Monitor usage** in OpenAI dashboard
4. **Set spending limits** in OpenAI account settings
5. **Batch generation** - Generate during content creation sessions, not continuously

## Future Enhancements

Easy additions if clients want more:
- **Content SEO Analyzer** - Real-time content scoring with suggestions
- **Smart Internal Link Recommendations** - AI-enhanced link suggestions
- **Schema Markup Generator** - Auto-generate structured data
- **Keyword Density Checker** - Analyze keyword usage
- **Readability Scores** - Flesch reading ease, grade level, etc.

All can use the same environment variable pattern for per-client control.
