import {NextResponse} from 'next/server'
import OpenAI from 'openai'

// CORS headers for Studio access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

// Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, {headers: corsHeaders})
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const {images} = await request.json()

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({error: 'No images provided'}, {status: 400, headers: corsHeaders})
    }

    // Analyze each image with GPT-4 Vision
    const analyzedImages = await Promise.all(
      images.map(async (image: any) => {
        try {
          const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: `Analyze this business image and provide:
1. Brief description (1 sentence)
2. Best website use (hero, team, about, services, testimonial, blog, etc.)
3. Subject type (people, product, office, exterior, logo, screenshot, etc.)
4. Quality assessment (excellent, good, fair, poor)
5. Orientation (landscape, portrait, square)

Respond in JSON format only:
{
  "description": "...",
  "bestUse": ["hero", "about"],
  "subjectType": "...",
  "quality": "...",
  "orientation": "..."
}`,
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: image.url,
                      detail: 'low', // Use low detail for faster/cheaper analysis
                    },
                  },
                ],
              },
            ],
            max_tokens: 300,
          })

          const content = response.choices[0]?.message?.content
          if (!content) {
            throw new Error('No response from GPT-4 Vision')
          }

          // Strip markdown code blocks if present
          let jsonContent = content.trim()
          if (jsonContent.startsWith('```json')) {
            jsonContent = jsonContent.replace(/^```json\s*\n?/, '').replace(/\n?```\s*$/, '')
          } else if (jsonContent.startsWith('```')) {
            jsonContent = jsonContent.replace(/^```\s*\n?/, '').replace(/\n?```\s*$/, '')
          }

          // Parse JSON response
          const analysis = JSON.parse(jsonContent)

          return {
            ...image,
            analysis,
          }
        } catch (error) {
          console.error(`Error analyzing image ${image._id}:`, error)
          return {
            ...image,
            analysis: {
              description: 'Image analysis failed',
              bestUse: ['general'],
              subjectType: 'unknown',
              quality: 'unknown',
              orientation: 'unknown',
            },
          }
        }
      })
    )

    return NextResponse.json({
      success: true,
      analyzedImages,
      count: analyzedImages.length,
    }, {headers: corsHeaders})
  } catch (error) {
    console.error('Error in analyze-images API:', error)
    return NextResponse.json(
      {error: 'Failed to analyze images', details: error instanceof Error ? error.message : 'Unknown error'},
      {status: 500, headers: corsHeaders}
    )
  }
}
