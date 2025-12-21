# AI Content Automation Setup

## Overview

This template includes an automated blog post generation system that uses AI to create complete blog articles on a schedule. Perfect for businesses that need consistent content without manual writing.

## How It Works

1. **GitHub Actions** triggers on your chosen schedule (1x, 2x, 3x per week, or daily)
2. **AI analyzes** your business profile, services, and existing content
3. **Generates topics** that are relevant and avoid duplicates
4. **Creates complete posts** with proper structure, SEO, and optional images
5. **Saves to Sanity** as drafts (for review) or auto-publishes
6. **Sends notifications** via email when posts are ready

## Setup Instructions

### 1. Enable AI Features

Add to `packages/web/.env.local`:

```bash
# Required
OPENAI_API_KEY=sk-proj-your-key-here
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
SANITY_API_TOKEN=skXXXXXXXXXXXXXXXXXXXXXXXXXXXX
CRON_SECRET=generate-with-openssl-rand-base64-32

# Optional (for email notifications)
POSTMARK_API_KEY=your-postmark-key
POSTMARK_FROM_EMAIL=noreply@yourdomain.com
```

### 2. Create Sanity API Token

1. Go to https://sanity.io/manage/personal/tokens
2. Click "Add API token"
3. Name: "AI Content Automation"
4. Permissions: **Editor** (or custom with create, read, update)
5. Copy the token to `SANITY_API_TOKEN`

### 3. Generate Cron Secret

```bash
openssl rand -base64 32
```

Copy the output to `CRON_SECRET` in your `.env.local`

### 4. Commit and Push Workflow File

The workflow file was created at `.github/workflows/generate-blog.yml`. You need to commit and push it to GitHub:

```bash
git add .github/workflows/generate-blog.yml
git commit -m "Add AI blog post generation workflow"
git push origin main
```

After pushing, the workflow will appear in your repository's Actions tab.

### 5. Configure GitHub Repository Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:
- `CRON_SECRET` - Same value as your `.env.local`
- `SITE_URL` - Your production URL (e.g., `https://yourdomain.com`)

### 6. Configure in Sanity Studio

1. Open your Sanity Studio
2. Go to **Profile** document
3. Navigate to **Settings** tab
4. Configure **AI Content Automation**:
   - ✅ Enable Auto-Generation
   - Choose frequency (1x, 2x, 3x per week, daily)
   - Select publish time (UTC timezone)
   - Set content style (professional, conversational, etc.)
   - Choose word count target
   - Toggle auto-publish (⚠️ recommended: keep OFF for review)
   - Enable/disable AI image generation
   - Add focus topics (optional)
   - Add exclude topics (optional)
   - Set notification email

### 7. Adjust Schedule (Optional)

Edit `.github/workflows/generate-blog.yml` to change timing:

```yaml
schedule:
  # Current: Monday, Wednesday, Friday at 9 AM UTC
  - cron: '0 9 * * 1'  # Monday
  - cron: '0 9 * * 3'  # Wednesday
  - cron: '0 9 * * 5'  # Friday
```

**Cron format**: `minute hour day-of-month month day-of-week`
- `0 9 * * 1` = Monday at 9:00 AM UTC
- `0 12 * * 1,3,5` = Mon/Wed/Fri at 12:00 PM UTC
- `0 6 * * *` = Every day at 6:00 AM UTC

**Convert to your timezone**:
- UTC 9:00 = EST 4:00 AM = PST 1:00 AM
- UTC 12:00 = EST 7:00 AM = PST 4:00 AM
- UTC 15:00 = EST 10:00 AM = PST 7:00 AM

## Cost Estimates

Per blog post:
- **Topic generation**: ~$0.001
- **Content generation** (1200-1800 words): ~$0.10-0.15
- **Excerpt + SEO meta**: ~$0.01
- **DALL-E image** (optional): ~$0.04
- **Total per post**: ~$0.15-0.20

Monthly costs:
- **1x per week**: ~$0.60-0.80/month
- **2x per week**: ~$1.20-1.60/month
- **3x per week**: ~$1.80-2.40/month
- **Daily (5x/week)**: ~$3.00-4.00/month

Per client with 3x/week publishing: **~$2-3/month**

## Testing

### Manual Trigger

Test the automation without waiting for the schedule:

1. **Verify workflow is pushed**: Make sure you've committed and pushed `.github/workflows/generate-blog.yml` to GitHub
2. Go to your GitHub repository
3. Click **Actions** tab (you should now see "Generate AI Blog Posts" in the workflows list)
4. Click on **Generate AI Blog Posts** workflow in the left sidebar
5. Click **Run workflow** button (top right)
6. Select branch (usually `main`) and click green **Run workflow** button
7. Wait for the workflow to complete (watch the progress)
8. Check Sanity Studio for the generated post

**Note**: If you don't see the workflow in the Actions tab:
- Ensure `.github/workflows/generate-blog.yml` exists in your repository
- Check that you've pushed the file to GitHub (`git push`)
- Refresh the Actions page
- Make sure you're looking at the correct repository

### Local Testing

Test the API endpoints locally. **Note**: The first two endpoints only generate content (return JSON) but don't save to Sanity:

```powershell
# 1. Test topic generation (returns JSON only)
curl.exe -X POST http://localhost:3000/api/ai/generate-topics `
  -H "Content-Type: application/json" `
  -d '{\"businessProfile\": {\"company_name\": \"Your Business\"}, \"count\": 3}'

# 2. Test blog post generation (returns JSON only)
curl.exe -X POST http://localhost:3000/api/ai/generate-blog-post `
  -H "Content-Type: application/json" `
  -d '{\"topic\": \"10 Tips for Better Customer Service\", \"style\": \"professional\", \"wordCount\": \"short\", \"generateImage\": false}'

# 3. Test FULL automation (actually creates post in Sanity)
# Replace YOUR_CRON_SECRET with the value from your .env.local
curl.exe -X POST http://localhost:3000/api/cron/generate-blog `
  -H "Authorization: Bearer YOUR_CRON_SECRET" `
  -H "Content-Type: application/json"
```

**The cron endpoint is what you need to test to see posts in Sanity!** It:
- Generates a topic
- Creates the full blog post
- Uploads images (if enabled)
- Saves to Sanity as draft or published
- Sends notification email

Make sure these are in your `.env.local` first:
- `SANITY_API_TOKEN` - For write access to Sanity
- `CRON_SECRET` - For authentication
- `NEXT_PUBLIC_SITE_URL` - For API callbacks

## Features

### Smart Topic Generation
- Analyzes your business profile and services
- Checks existing posts to avoid duplicates
- Respects focus topics and exclusions
- Generates SEO-friendly titles

### Complete Post Creation
- Proper portable text structure with h2 headings
- 800-2500 word articles (configurable)
- Automatic excerpt generation
- SEO meta title and description
- Optional AI-generated featured images
- Unique slug generation

### Safety Features
- **Draft-first by default** - Review before publishing
- **Duplicate detection** - Won't write same topic twice
- **Topic exclusions** - Avoid sensitive subjects
- **Manual override** - Disable anytime in Studio
- **Email notifications** - Know when posts are ready

### Flexible Scheduling
- 1x, 2x, 3x per week, or daily
- Configurable publish times
- Manual trigger available
- Per-project control via Studio

## Workflow

1. **Schedule triggers** (GitHub Actions cron)
2. **Fetch settings** from Sanity Profile
3. **Check if enabled** and AI features active
4. **Generate topic** based on business context
5. **Create blog post** with AI
6. **Upload image** to Sanity (if enabled)
7. **Save to Sanity** as draft or published
8. **Send notification** email
9. **Log completion** in GitHub Actions

## Troubleshooting

### Posts not generating

1. **Check GitHub Actions logs**:
   - Repository → Actions → Latest run
   - Look for error messages

2. **Verify secrets are set**:
   - `CRON_SECRET` in both `.env.local` and GitHub
   - `SITE_URL` points to correct domain

3. **Check Sanity Studio settings**:
   - AI Content Automation is enabled
   - Profile document exists

4. **Verify API tokens**:
   - `SANITY_API_TOKEN` has Editor permissions
   - `OPENAI_API_KEY` is valid

### Posts generate but aren't visible

1. **Check auto-publish setting** in Profile → Settings
2. Look in Sanity Studio → Desk → Posts for drafts
3. If drafts exist, posts are working (just not auto-published)

### Images not generating

1. DALL-E costs extra (~$0.04/image)
2. Check `generateImages` setting in Profile
3. Verify OpenAI API key has image generation enabled
4. Images may fail gracefully - post still creates

### Wrong schedule

1. Edit `.github/workflows/generate-blog.yml`
2. Adjust cron expressions
3. Commit and push changes
4. Remember cron uses UTC timezone

## Disabling

To temporarily disable:

1. **Sanity Studio**: Profile → Settings → Uncheck "Enable Auto-Generation"
2. **Permanently**: Delete `.github/workflows/generate-blog.yml`

## Monitoring

**GitHub Actions**:
- View execution history
- Check success/failure rates
- Download logs for debugging

**Sanity Studio**:
- Review generated posts
- Edit before publishing
- Check post quality

**Email Notifications**:
- Receive alerts when posts are ready
- Links to edit in Studio
- Status (draft vs published)

## Best Practices

1. **Start with drafts** - Review quality before enabling auto-publish
2. **Monitor first week** - Check generated content aligns with brand
3. **Adjust frequency** - Start lower, increase as comfortable
4. **Use focus topics** - Guide AI toward relevant subjects
5. **Set exclusions** - Avoid controversial or sensitive topics
6. **Review periodically** - Ensure content quality remains high

## Per-Client Billing

If offering this as a service:

**Recommended pricing**:
- Setup fee: $100-200 (one-time)
- Monthly service: $50-100/month (3x per week)
- Your cost: ~$2-3/month (96% profit margin)

**Value proposition**:
- 12+ professional blog posts per month
- SEO-optimized content
- Consistent publishing schedule
- Featured images included
- No manual writing required

## Support

For issues or questions:
1. Check GitHub Actions logs
2. Review Sanity Studio settings
3. Verify environment variables
4. Test manual trigger first
5. Check API endpoints individually
