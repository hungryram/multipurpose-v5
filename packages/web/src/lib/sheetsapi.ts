import {google} from 'googleapis'

export async function sendToSheet(
  data: Record<string, any>,
  spreadsheetId: string,
  sheetName: string = 'Sheet1'
) {
  try {
    const privateKey = process.env.SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n')
    
    if (!privateKey || !process.env.SHEETS_CLIENT_EMAIL) {
      console.log('[Google Sheets] Credentials not configured, skipping...')
      return false
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.SHEETS_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const googleSheets = google.sheets({
      version: 'v4',
      auth,
    })

    // Add timestamp
    const rowData = {
      Timestamp: new Date().toLocaleString(),
      ...data,
    }

    await googleSheets.spreadsheets.values.append({
      spreadsheetId,
      range: sheetName,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [Object.values(rowData)],
      },
    })

    console.log('[Google Sheets] Data sent successfully')
    return true
  } catch (error) {
    console.error('[Google Sheets] Error:', error)
    return false
  }
}
