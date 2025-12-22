import {NextRequest, NextResponse} from 'next/server'
import OpenAI from 'openai'
import {writeClient} from '@/lib/sanity/client'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    // CORS headers for Studio
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

    // Check if AI features are enabled
    if (process.env.NEXT_PUBLIC_ENABLE_AI_FEATURES !== 'true') {
      return NextResponse.json(
        {error: 'AI features are not enabled'},
        {status: 403, headers}
      )
    }

    const {prompt, style = 'natural', quality = 'standard', size = '1024x1024'} = await request.json()

    if (!prompt) {
      return NextResponse.json({error: 'Prompt is required'}, {status: 400, headers})
    }

    // Enhance prompt based on style
    let enhancedPrompt = prompt
    
    switch (style) {
      case 'photographic':
        enhancedPrompt = `Professional photograph: ${prompt}. High-quality, sharp focus, professional lighting, realistic.`
        break
      case 'digital-art':
        enhancedPrompt = `Digital art illustration: ${prompt}. Modern, clean, professional design.`
        break
      case 'minimalist':
        enhancedPrompt = `Minimalist design: ${prompt}. Clean, simple, modern aesthetic with lots of negative space.`
        break
      case 'abstract':
        enhancedPrompt = `Abstract artistic interpretation: ${prompt}. Creative, artistic, modern.`
        break
      case 'illustration':
        enhancedPrompt = `Professional illustration: ${prompt}. Detailed, polished, commercial quality.`
        break
      case 'natural':
      default:
        // Use prompt as-is
        break
    }

    // Generate image with DALL-E 3
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      n: 1,
      size: size as '1024x1024' | '1024x1792' | '1792x1024',
      quality: quality as 'standard' | 'hd',
    })

    const imageUrl = response.data?.[0]?.url

    if (!imageUrl) {
      return NextResponse.json(
        {error: 'Failed to generate image'},
        {status: 500, headers}
      )
    }

    // Download image on server side
    const imageResponse = await fetch(imageUrl)
    const imageBuffer = await imageResponse.arrayBuffer()
    const imageBlob = new Blob([imageBuffer])

    // Upload to Sanity
    const asset = await writeClient.assets.upload('image', imageBlob as any, {
      filename: `ai-generated-${Date.now()}.png`,
    })

    return NextResponse.json(
      {
        success: true,
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
        revisedPrompt: response.data?.[0]?.revised_prompt,
      },
      {headers}
    )
  } catch (error) {
    console.error('Error generating image:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate image',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      {status: 500}
    )
  }
}

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
