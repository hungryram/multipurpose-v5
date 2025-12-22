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

/**
 * Parse text with markdown formatting into portable text spans with marks
 */
function parseInlineMarkdown(text: string, markDefs: any[] = []): any[] {
  const spans: any[] = []
  let currentText = ''
  let i = 0

  const flushText = (marks: string[] = []) => {
    if (currentText) {
      spans.push({
        _type: 'span',
        _key: `span-${spans.length}`,
        text: currentText,
        marks,
      })
      currentText = ''
    }
  }

  while (i < text.length) {
    // Markdown links [text](url)
    if (text[i] === '[') {
      flushText()
      i++
      let linkText = ''
      while (i < text.length && text[i] !== ']') {
        linkText += text[i]
        i++
      }
      i++ // skip ]
      if (i < text.length && text[i] === '(') {
        i++
        let linkUrl = ''
        while (i < text.length && text[i] !== ')') {
          linkUrl += text[i]
          i++
        }
        i++ // skip )
        
        // Create mark definition for this link
        const markKey = `link-${markDefs.length}`
        markDefs.push({
          _key: markKey,
          _type: 'link',
          href: linkUrl,
        })
        
        spans.push({
          _type: 'span',
          _key: `span-${spans.length}`,
          text: linkText,
          marks: [markKey],
        })
        continue
      }
    }
    
    // Bold text **text**
    if (text[i] === '*' && text[i + 1] === '*') {
      flushText()
      i += 2
      const boldStart = i
      while (i < text.length && !(text[i] === '*' && text[i + 1] === '*')) {
        currentText += text[i]
        i++
      }
      flushText(['strong'])
      i += 2
      continue
    }

    currentText += text[i]
    i++
  }

  flushText()
  return spans.length > 0 ? spans : [{_type: 'span', _key: 'span-0', text, marks: []}]
}

/**
 * Convert markdown-style content to Sanity Portable Text format
 */
function convertToPortableText(markdown: string): any[] {
  // Remove markdown images (we can't use fake URLs)
  markdown = markdown.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '')
  
  const blocks: any[] = []
  const lines = markdown.split('\n')
  let currentParagraph: string[] = []

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(' ').trim()
      if (text) {
        const markDefs: any[] = []
        blocks.push({
          _type: 'block',
          _key: `block-${blocks.length}`,
          style: 'normal',
          markDefs,
          children: parseInlineMarkdown(text, markDefs),
        })
      }
      currentParagraph = []
    }
  }

  lines.forEach((line) => {
    const trimmed = line.trim()

    // Empty line - flush current paragraph
    if (!trimmed) {
      flushParagraph()
      return
    }

    // Heading (strip all # characters)
    if (trimmed.startsWith('#')) {
      flushParagraph()
      const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/)
      if (headingMatch) {
        const level = headingMatch[1].length
        const text = headingMatch[2]
        const style = level === 1 ? 'h2' : level === 2 ? 'h2' : 'h3' // Convert h1 to h2
        blocks.push({
          _type: 'block',
          _key: `block-${blocks.length}`,
          style,
          markDefs: [],
          children: parseInlineMarkdown(text),
        })
      }
      return
    }

    // List item
    if (trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed)) {
      flushParagraph()
      const text = trimmed.replace(/^-\s|^\d+\.\s/, '')
      blocks.push({
        _type: 'block',
        _key: `block-${blocks.length}`,
        style: 'normal',
        listItem: trimmed.startsWith('-') ? 'bullet' : 'number',
        markDefs: [],
        children: parseInlineMarkdown(text),
      })
      return
    }

    // Regular paragraph text
    currentParagraph.push(trimmed)
  })

  flushParagraph()
  return blocks
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
      topic,
      keywords = [],
      style = 'professional',
      wordCount = 'medium',
      businessProfile,
      generateImage,
      imageStyle,
      imageQuality,
      relatedArticles = [],
    } = body

    if (!topic) {
      return NextResponse.json(
        {error: 'Topic is required'},
        {status: 400, headers: corsHeaders}
      )
    }

    // Determine target word count
    const targetWords =
      wordCount === 'short' ? '800-1200' : wordCount === 'long' ? '1800-2500' : '1200-1800'

    // Build context
    // Fetch brand brief for enhanced context
    const brandBrief = await client.fetch(brandBriefQuery)

    // Build context
    const contextParts = []
    if (businessProfile?.company_name) {
      contextParts.push(`Business: ${businessProfile.company_name}`)
    }
    
    // Enhanced context from Brand Brief
    if (brandBrief) {
      if (brandBrief.businessOverview) {
        contextParts.push(`Business Overview: ${brandBrief.businessOverview}`)
      }
      
      if (brandBrief.industry) {
        contextParts.push(`Industry: ${brandBrief.industry}`)
      }
      
      if (brandBrief.productServices) {
        contextParts.push(`Products/Services: ${brandBrief.productServices}`)
      }
      
      if (brandBrief.uniqueSellingProposition) {
        contextParts.push(`Unique Value: ${brandBrief.uniqueSellingProposition}`)
      }
      
      if (brandBrief.targetAudience) {
        contextParts.push(`Target Audience: ${brandBrief.targetAudience}`)
      }
      
      if (brandBrief.audiencePainPoints && brandBrief.audiencePainPoints.length > 0) {
        contextParts.push(`Audience Challenges: ${brandBrief.audiencePainPoints.slice(0, 3).join(', ')}`)
      }
    }
    
    if (keywords.length > 0) {
      contextParts.push(`Target keywords: ${keywords.join(', ')}`)
    }
    if (relatedArticles.length > 0) {
      contextParts.push(`\nRelated articles you can reference (use markdown links):`)
      relatedArticles.forEach((article: any) => {
        contextParts.push(`- [${article.title}](/blog/${article.slug})`)
      })
    }

    const context = contextParts.join('\n')
    
    // Build tone/voice instructions
    let voiceInstructions = ''
    if (brandBrief?.toneOfVoice && brandBrief.toneOfVoice.length > 0) {
      voiceInstructions += `\nTONE OF VOICE: ${brandBrief.toneOfVoice.join(', ')}`
    }
    if (brandBrief?.writingStyle) {
      voiceInstructions += `\nWRITING STYLE: ${brandBrief.writingStyle}`
    }
    if (brandBrief?.avoidWords && brandBrief.avoidWords.length > 0) {
      voiceInstructions += `\nAVOID these words: ${brandBrief.avoidWords.join(', ')}`
    }
    if (brandBrief?.preferredWords && brandBrief.preferredWords.length > 0) {
      voiceInstructions += `\nPREFER these words/phrases: ${brandBrief.preferredWords.join(', ')}`
    }

    // Generate blog post content
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert blog writer creating ${style} content for a business blog.
Write comprehensive, engaging, and SEO-optimized blog posts.
Use markdown formatting with ## for main sections (h2 headings).
Use **bold** for emphasis on key terms.
Target length: ${targetWords} words.
Make it valuable, actionable, and well-structured.${voiceInstructions}

STRUCTURE REQUIREMENTS:
- Start with an introduction paragraph (NO heading for intro)
- Include 5-7 main sections with ## h2 headings
- End with a conclusion section with ## Conclusion heading
- Each section should be 2-3 paragraphs

INTERNAL LINKING FOR SEO:
- When related articles are provided, naturally reference 2-3 of them using markdown links: [article title](/blog/slug)
- Only link to articles that are contextually relevant
- Place links naturally within the content where they add value
- Don't force links - only include if genuinely helpful

IMPORTANT: Do NOT include:
- A title heading with # (the title will be displayed separately)
- Fake URLs or external links (no example.com)
- Markdown images (no ![alt](url))
- External references you can't verify

Focus on informative text content with strategic internal links.`,
        },
        {
          role: 'user',
          content: `Write a complete blog post about: ${topic}${context ? `\n\nContext:\n${context}` : ''}`,
        },
      ],
      temperature: 0.7,
    })

    const markdown = completion.choices[0]?.message?.content
    if (!markdown) {
      throw new Error('No content generated')
    }

    // Extract title (first line or first h1/h2)
    const titleMatch = markdown.match(/^#+ (.+)$/m)
    const title = titleMatch ? titleMatch[1] : topic

    // Remove the first heading from markdown if it matches the title (avoid duplication on page)
    let cleanedMarkdown = markdown
    if (titleMatch) {
      cleanedMarkdown = markdown.replace(/^#+ .+$/m, '').trim()
    }

    // Convert markdown to portable text
    const body_content = convertToPortableText(cleanedMarkdown)

    // Generate excerpt
    const excerptCompletion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Create a compelling 1-2 sentence summary (under 160 characters) for this blog post.',
        },
        {
          role: 'user',
          content: markdown.substring(0, 500),
        },
      ],
      temperature: 0.5,
    })

    const excerpt = excerptCompletion.choices[0]?.message?.content || ''

    // Generate SEO meta
    const seoCompletion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Generate SEO metadata as JSON:
{
  "metaTitle": "50-60 character SEO title",
  "metaDescription": "120-155 character meta description"
}`,
        },
        {
          role: 'user',
          content: markdown.substring(0, 500),
        },
      ],
      temperature: 0.5,
      response_format: {type: 'json_object'},
    })

    const seoText = seoCompletion.choices[0]?.message?.content
    const seo = seoText ? JSON.parse(seoText) : {}

    // Use Brand Brief settings for image generation if not explicitly provided
    const shouldGenerateImage = generateImage !== undefined ? generateImage : brandBrief?.aiImageGeneration !== false
    const finalImageStyle = imageStyle || brandBrief?.aiImageStyle || 'photographic'
    const finalImageQuality = imageQuality || brandBrief?.aiImageQuality || 'standard'

    // Generate featured image if requested
    let imageAsset = null
    if (shouldGenerateImage) {
      try {
        // Build image prompt based on article content and style
        let imagePrompt = `Professional blog featured image for article about: ${title}.`
        
        // Enhance prompt based on style
        switch (finalImageStyle) {
          case 'photographic':
            imagePrompt += ' High-quality photograph, professional, sharp focus, realistic.'
            break
          case 'digital-art':
            imagePrompt += ' Modern digital art, clean design, professional.'
            break
          case 'minimalist':
            imagePrompt += ' Minimalist design, clean, simple, modern, lots of negative space.'
            break
          case 'abstract':
            imagePrompt += ' Abstract artistic interpretation, creative, modern.'
            break
          case 'illustration':
            imagePrompt += ' Professional illustration, detailed, polished, commercial quality.'
            break
          case 'natural':
          default:
            imagePrompt += ' Clean, professional, corporate-friendly.'
            break
        }
        
        const imageResponse = await openai.images.generate({
          model: 'dall-e-3',
          prompt: imagePrompt,
          size: '1792x1024',
          quality: finalImageQuality as 'standard' | 'hd',
          n: 1,
        })

        const imageUrl = imageResponse.data?.[0]?.url
        if (imageUrl) {
          // Download and upload to Sanity
          const imageBuffer = await fetch(imageUrl).then((r) => r.arrayBuffer())
          
          // Return image data for manual upload or include URL for client-side handling
          imageAsset = {
            imageUrl,
            revisedPrompt: imageResponse.data?.[0]?.revised_prompt,
            // Will be uploaded to Sanity in the cron endpoint
          }
        }
      } catch (error) {
        console.error('Image generation failed:', error)
        // Continue without image
      }
    }

    return NextResponse.json(
      {
        title,
        body: body_content,
        excerpt,
        seo,
        imageAsset,
      },
      {headers: corsHeaders}
    )
  } catch (error) {
    console.error('Blog post generation error:', error)
    return NextResponse.json(
      {error: 'Failed to generate blog post', details: error instanceof Error ? error.message : 'Unknown error'},
      {status: 500, headers: corsHeaders}
    )
  }
}
