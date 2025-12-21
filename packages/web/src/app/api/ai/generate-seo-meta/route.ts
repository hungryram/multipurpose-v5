import {NextRequest, NextResponse} from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    // Add CORS headers for Studio
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {error: 'OpenAI API key not configured'},
        {status: 500, headers}
      )
    }

    // Check if AI features are enabled globally
    if (process.env.NEXT_PUBLIC_ENABLE_AI_FEATURES !== 'true') {
      return NextResponse.json(
        {error: 'AI features are not enabled'},
        {status: 403, headers}
      )
    }

    const {content, pageTitle, pageType} = await request.json()

    if (!content) {
      return NextResponse.json({error: 'Content is required'}, {status: 400, headers})
    }

    // Convert portable text or extract plain text from content
    const plainText =
      typeof content === 'string'
        ? content
        : JSON.stringify(content).slice(0, 3000) // Limit to save tokens

    const prompt = `You are an SEO expert. Based on the following ${pageType || 'page'} content, generate:
1. An optimized meta title (50-60 characters, include primary keyword at start)
2. An optimized meta description (120-155 characters, compelling and includes call-to-action)

Page title: ${pageTitle || 'Untitled'}

Content:
${plainText}

Respond ONLY with a JSON object in this exact format:
{"metaTitle": "your title here", "metaDescription": "your description here"}`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: {type: 'json_object'},
      max_tokens: 200,
    })

    const result = JSON.parse(response.choices[0]?.message?.content || '{}')

    return NextResponse.json({
      metaTitle: result.metaTitle || '',
      metaDescription: result.metaDescription || '',
    }, {headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }})
  } catch (error: any) {
    console.error('SEO meta generation error:', error)
    return NextResponse.json(
      {error: error.message || 'Failed to generate SEO metadata'},
      {status: 500, headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }}
    )
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}
