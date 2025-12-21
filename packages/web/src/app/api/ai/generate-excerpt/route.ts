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

    const {title, content} = await request.json()

    if (!title && !content) {
      return NextResponse.json(
        {error: 'Title or content is required'},
        {status: 400, headers}
      )
    }

    // Convert portable text or extract plain text from content
    const plainText =
      typeof content === 'string'
        ? content
        : JSON.stringify(content).slice(0, 2000) // Limit to save tokens

    const prompt = `You are a professional copywriter. Based on the following blog post, write a compelling excerpt/summary that will entice readers to click and read more.

Title: ${title || 'Untitled'}

Content:
${plainText}

Requirements:
- 1-2 sentences maximum (under 160 characters)
- Hook the reader with the main value or benefit
- No fluff, be specific and compelling
- Don't use "this post" or "this article" - write in active voice

Respond with ONLY the excerpt text, nothing else.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 100,
    })

    const excerpt = response.choices[0]?.message?.content?.trim() || ''

    return NextResponse.json({excerpt}, {headers})
  } catch (error: any) {
    console.error('Excerpt generation error:', error)
    return NextResponse.json(
      {error: error.message || 'Failed to generate excerpt'},
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    )
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  )
}
