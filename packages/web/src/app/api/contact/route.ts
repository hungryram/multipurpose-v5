import {NextResponse} from 'next/server'
import {ServerClient} from 'postmark'
import {client} from '@/lib/sanity/client'
import {sendToSheet} from '@/lib/sheetsapi'
import groq from 'groq'

// Only initialize Postmark if API key is provided
const postmarkClient = process.env.POSTMARK_API_KEY 
  ? new ServerClient(process.env.POSTMARK_API_KEY)
  : null

const profileQuery = groq`*[_type == "profile"][0] {
  contact_information {
    email
  }
}`

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data || Object.keys(data).length === 0) {
      console.error('[Contact Form] No data provided')
      return NextResponse.json(
        {error: 'No data provided'},
        {status: 400}
      )
    }

    // Get notification email from form data or fallback to profile
    let notificationEmail = data._notificationEmail
    
    if (!notificationEmail) {
      // Fetch notification email from Sanity profile as fallback
      const profile = await client.fetch(profileQuery)
      notificationEmail = profile?.contact_information?.email
    } else {
      // Remove internal field from data before sending email
      delete data._notificationEmail
    }

    // Extract and remove submission URL
    const submittedFrom = data._submittedFrom || 'Unknown'
    delete data._submittedFrom

    // Extract and remove field labels
    const fieldLabels = data._fieldLabels || {}
    delete data._fieldLabels

    // Extract Google Sheets config from form data
    const googleSheetId = data._googleSheetId
    const googleSheetTabName = data._googleSheetTabName || 'Sheet1'
    delete data._googleSheetId
    delete data._googleSheetTabName

    // Send email via Postmark if configured
    if (postmarkClient && notificationEmail) {
      
      try {
        const emailResult = await postmarkClient.sendEmail({
          From: process.env.FROM_EMAIL || 'forms@hungryramwebdesign.com',
          To: notificationEmail,
          Subject: 'New Contact Form Submission',
          HtmlBody: generateEmailHTML(data, submittedFrom, fieldLabels),
          TextBody: generateEmailText(data, submittedFrom, fieldLabels),
          MessageStream: 'outbound',
        })
      } catch (emailError) {
        console.error('[Contact Form] Postmark error:', emailError)
        console.error('[Contact Form] Error details:', JSON.stringify(emailError, null, 2))
        
        // Still return success to user, but log the error
        return NextResponse.json(
          {message: 'Form submitted but email failed to send'},
          {status: 200}
        )
      }
    } else {
      console.warn('[Contact Form] Email not sent - Missing:', {
        postmarkClient: !!postmarkClient,
        notificationEmail: !!notificationEmail,
        POSTMARK_API_KEY: !!process.env.POSTMARK_API_KEY
      })
    }

    // Send to Google Sheets if configured (either in form or env vars)
    const sheetId = googleSheetId || process.env.GOOGLE_SHEETS_ID
    if (sheetId && (process.env.SHEETS_CLIENT_EMAIL && process.env.SHEETS_PRIVATE_KEY)) {
      // Prepare data for sheets with proper labels
      const sheetData: Record<string, any> = {}
      Object.entries(data).forEach(([key, value]) => {
        const label = fieldLabels[key] || key
        sheetData[label] = value
      })
      
      await sendToSheet(
        sheetData,
        sheetId,
        googleSheetTabName
      )
    }

    return NextResponse.json(
      {message: 'Form submitted successfully'},
      {status: 200}
    )
  } catch (error) {
    console.error('Form submission error:', error)
    return NextResponse.json(
      {error: 'Failed to submit form'},
      {status: 500}
    )
  }
}

// Helper function to generate email HTML
function generateEmailHTML(data: Record<string, any>, submittedFrom: string, fieldLabels: Record<string, string>): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <table style="border-collapse: collapse; width: 100%; margin-top: 20px;">
            ${Object.entries(data)
              .map(
                ([key, value]) => `
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 8px; font-weight: bold; width: 150px;">
                  ${fieldLabels[key] || key}:
                </td>
                <td style="padding: 12px 8px;">${value}</td>
              </tr>
            `
              )
              .join('')}
          </table>
          <p style="margin-top: 30px; color: #666; font-size: 12px;">
            Submitted at ${new Date().toLocaleString()}<br>
            From: <a href="${submittedFrom}" style="color: #2563eb;">${submittedFrom}</a>
          </p>
        </div>
      </body>
    </html>
  `
}

// Helper function to generate plain text email
function generateEmailText(data: Record<string, any>, submittedFrom: string, fieldLabels: Record<string, string>): string {
  return `
New Contact Form Submission

${Object.entries(data)
  .map(([key, value]) => `${fieldLabels[key] || key}: ${value}`)
  .join('\n')}

Submitted at ${new Date().toLocaleString()}
From: ${submittedFrom}
  `.trim()
}
