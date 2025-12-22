import {NextResponse} from 'next/server'
import OpenAI from 'openai'
import {client} from '@/lib/sanity/client'
import {brandBriefQuery} from '@/lib/sanity/queries'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// CORS headers for Sanity Studio
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return NextResponse.json({}, {headers: corsHeaders})
}

export async function POST(request: Request) {
  try {
    // Check if AI features are enabled
    if (process.env.NEXT_PUBLIC_ENABLE_AI_FEATURES !== 'true') {
      return NextResponse.json(
        {error: 'AI features are not enabled'},
        {status: 403, headers: corsHeaders}
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {error: 'OpenAI API key not configured'},
        {status: 500, headers: corsHeaders}
      )
    }

    const body = await request.json()
    const {
      businessProfile,
      services,
      existingTopics = [],
      focusTopics = [],
      excludeTopics = [],
      count = 5,
    } = body

    // Fetch brand brief for enhanced context
    const brandBrief = await client.fetch(brandBriefQuery)

    // Build context for AI
    const contextParts = []
    
    if (businessProfile?.company_name) {
      contextParts.push(`Business: ${businessProfile.company_name}`)
    }
    
    if (businessProfile?.description) {
      contextParts.push(`Description: ${businessProfile.description}`)
    }

    // Enhanced context from Brand Brief
    if (brandBrief) {
      if (brandBrief.businessOverview) {
        contextParts.push(`Business Overview: ${brandBrief.businessOverview}`)
      }
      
      if (brandBrief.industry) {
        contextParts.push(`Industry: ${brandBrief.industry}`)
      }
      
      if (brandBrief.businessModel) {
        contextParts.push(`Business Model: ${brandBrief.businessModel}`)
      }
      
      if (brandBrief.productServices) {
        contextParts.push(`Products/Services: ${brandBrief.productServices}`)
      }
      
      if (brandBrief.uniqueSellingProposition) {
        contextParts.push(`Unique Selling Proposition: ${brandBrief.uniqueSellingProposition}`)
      }
      
      if (brandBrief.targetAudience) {
        contextParts.push(`Target Audience: ${brandBrief.targetAudience}`)
      }
      
      if (brandBrief.audiencePainPoints && brandBrief.audiencePainPoints.length > 0) {
        contextParts.push(`Audience Pain Points: ${brandBrief.audiencePainPoints.join(', ')}`)
      }
      
      if (brandBrief.audienceGoals && brandBrief.audienceGoals.length > 0) {
        contextParts.push(`Audience Goals: ${brandBrief.audienceGoals.join(', ')}`)
      }
      
      if (brandBrief.seedKeywords && brandBrief.seedKeywords.length > 0) {
        contextParts.push(`Target Keywords: ${brandBrief.seedKeywords.join(', ')}`)
      }
      
      if (brandBrief.topicClusters && brandBrief.topicClusters.length > 0) {
        contextParts.push(`Topic Clusters: ${brandBrief.topicClusters.join(', ')}`)
      }
      
      if (brandBrief.competitors && brandBrief.competitors.length > 0) {
        const competitorNames = brandBrief.competitors.map((c: any) => c.name).join(', ')
        contextParts.push(`Main Competitors: ${competitorNames}`)
      }
    }

    if (services && services.length > 0) {
      contextParts.push(`Services: ${services.map((s: any) => s.title).join(', ')}`)
    }

    if (focusTopics.length > 0) {
      contextParts.push(`Focus on: ${focusTopics.join(', ')}`)
    }

    if (excludeTopics.length > 0) {
      contextParts.push(`Avoid: ${excludeTopics.join(', ')}`)
    }

    if (existingTopics.length > 0) {
      contextParts.push(`Already covered topics (avoid duplicates): ${existingTopics.slice(0, 20).join(', ')}`)
    }

    const context = contextParts.join('\n')

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a content strategist generating blog post topics for a business. 
Create relevant, engaging, and SEO-friendly blog post ideas that would be valuable to their target audience.
Topics should be specific, actionable, and aligned with the business's services and expertise.

IMPORTANT: 
- Topics can be related to existing articles but must have a UNIQUE angle or focus
- Example: If "Lightweight Cooking Gear" exists, you can suggest "Winter Cooking Techniques" or "Cooking Gear Maintenance"
- Avoid exact duplicate titles, but related topics are encouraged for comprehensive coverage

Return only a JSON array of topic objects with this structure:
[
  {
    "title": "Compelling blog post title",
    "description": "Brief description of what the post would cover",
    "keywords": ["keyword1", "keyword2", "keyword3"]
  }
]`,
        },
        {
          role: 'user',
          content: `Generate ${count} unique blog post topics based on this context:\n\n${context}`,
        },
      ],
      temperature: 0.8,
      response_format: {type: 'json_object'},
    })

    const responseText = completion.choices[0]?.message?.content
    if (!responseText) {
      throw new Error('No response from OpenAI')
    }

    const result = JSON.parse(responseText)
    const topics = result.topics || result

    return NextResponse.json({topics}, {headers: corsHeaders})
  } catch (error) {
    console.error('Topic generation error:', error)
    return NextResponse.json(
      {error: 'Failed to generate topics', details: error instanceof Error ? error.message : 'Unknown error'},
      {status: 500, headers: corsHeaders}
    )
  }
}
