# Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets integration for your contact forms to automatically save submissions to a Google Sheet.

## Prerequisites

- A Google account
- Access to Google Cloud Console
- A Google Sheet created and ready to receive form data

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a Project** → **New Project**
3. Enter a project name (e.g., "Contact Form Integration")
4. Click **Create**

## Step 2: Enable Google Sheets API

1. In your project, go to **APIs & Services** → **Library**
2. Search for "Google Sheets API"
3. Click on it and press **Enable**

## Step 3: Create a Service Account

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **Service Account**
3. Fill in the details:
   - Service account name: `contact-form-service`
   - Service account ID: (auto-generated)
   - Click **Create and Continue**
4. Skip the optional steps and click **Done**

## Step 4: Create and Download Service Account Key

1. On the Credentials page, find your newly created service account
2. Click on the service account email
3. Go to the **Keys** tab
4. Click **Add Key** → **Create new key**
5. Select **JSON** format
6. Click **Create**
7. A JSON file will be downloaded - **save this file securely!**

## Step 5: Share Your Google Sheet

1. Open your Google Sheet
2. Copy the **Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```
3. Click the **Share** button
4. Add the service account email (found in the JSON file as `client_email`)
5. Give it **Editor** permissions
6. Click **Done**

## Step 6: Configure Google Sheets in Sanity Studio

Google Sheets integration can be configured in two ways:

### Option 1: Per-Form Configuration (Recommended)

Configure Google Sheets directly in Sanity Studio for each contact form:

1. Open your Sanity Studio
2. Edit a page with a contact form
3. In the contact form block, go to the **Settings** tab
4. Find the Google Sheets fields:
   - **Google Sheet ID**: Paste your sheet ID from Step 5
   - **Google Sheet Tab Name**: Enter the tab name (default: `Sheet1`)

**Benefits:**
- Different forms can save to different sheets
- No code changes needed
- Easy for content editors to manage
- Sheet ID visible in Sanity for easy reference

### Option 2: Global Configuration via Environment Variables

For sites using the same sheet for all forms, add to `.env.local`:

```env
GOOGLE_SHEETS_ID=your-sheet-id-from-step-5
GOOGLE_SHEETS_TAB_NAME=Sheet1
```

**Note:** Per-form configuration (Option 1) takes precedence over environment variables.

## Step 7: Add Service Account Credentials

Add these to your `.env.local` file (required for both options):

## Step 7: Add Service Account Credentials

Add these to your `.env.local` file (required for both options):

```env
# Google Sheets Service Account Credentials (Required)
SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"

# Optional: Global defaults (can be overridden per-form in Sanity)
GOOGLService Account Credentials** (Required):
   - **SHEETS_CLIENT_EMAIL**: From JSON file's `client_email`
   - **SHEETS_PRIVATE_KEY**: From JSON file's `private_key`
   - Keep quotes around the key with `\n` characters as-is

2. **Sheet Configuration** (Choose one method):
   - **Per-Form** (Recommended): Configure in Sanity Studio Settings tab
   - **Global**: Use environment variables as defaults

## Step 8LE_SHEETS_TAB_NAME**: The name of the tab/sheet (default is "Sheet1")
3. **SHEETS_CLIENT_EMAIL**: Found in your downloaded JSON file as `client_email`
4. **SHEETS_PRIVATE_KEY**: Found in your downloaded JSON file as `private_key`
   - Keep the quotes around the key
   - The `\n` characters should remain as-is (they represent line breaks)

## Step 7: Set Up Your Sheet Headers

Your Google Sheet should have headers in the first row matching your form fields. For example:

| Timestamp | Name | Email | Message |
|-----------|------|-------|---------|

The scri9t automatically adds a `Timestamp` column with the submission date/time.

## Step 8: Test the Integration

1. Restart your development server:
   ```bash
   cd packages/web
   pnpm dev
   ```

2. Submit a test form on your website

3. Check your Google Sheet - you should see a new row with the submission data

4. Check the terminal logs - you should see:
   ```
   [Google Sheets] Data sent successfully
   ```

## Troubleshooting

### "Credentials not configured" Message

- The integration is optional. If you see this message but don't need Google Sheets, you can ignore it
- If you do need it, make sure all environment variables are set correctly

### "Error sending to Google Sheets"

1. **Check Service Account Permissions**:
   - Verify the service account email has Editor access to your sheet
   - Double-check you used the correct email from the JSON file

2. **Verify Private Key Format**:
   - The private key must be in quotes
   - Keep the `\n` characters (don't replace them with actual line breaks)
   - Make sure there are no extra spaces

3. **Check Sheet ID**:
   - Copy the ID from the URL, not the sheet name
   - It should be a long alphanumeric string

4. **Verify Tab Name**:
   - The tab name is case-sensitive
   - Check it matches exactly (including spaces)

### Data Not Appearing in Sheet

- Make sure your sheet has headers in row 1
- The field labels from your form will map to these headers
- If a header doesn't exist, data will still be added to the row

## Security Best Practices

1. **Never commit the JSON file** to version control
2. **Keep your `.env.local` file** out of Git (it's in `.gitignore`)
3. **Rotate service account keys** periodically
4. **Use separate service accounts** for production and development
5. **Restrict service account permissions** to only what's needed

## Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add all environment variables to your hosting platform's environment settings
2. Use a different Google Sheet for production (recommended)
3. Create a separate service account for production
4. Never expose your private key in client-side code

## Disabling Google Sheets Integration

To disable completely:

1. Remove Google Sheet ID from Sanity Studio forms
2. Remove `GOOGLE_SHEETS_ID` from `.env.local` (if using global config)
3. Keep or remove service account credentials as needed

To disable for specific forms:
- Simply leave the Google Sheet fields empty in that form's settings

## Need Help?

- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Service Account Authentication Guide](https://cloud.google.com/iam/docs/service-accounts)
- Check the terminal logs for detailed error messages
