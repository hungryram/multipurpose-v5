import {NextResponse} from 'next/server'
import {createClient} from '@sanity/client'

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-12-18',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

export async function POST(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization')
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`
    
    if (authHeader !== expectedAuth) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    // Check if AI features are enabled
    if (process.env.NEXT_PUBLIC_ENABLE_AI_FEATURES !== 'true') {
      return NextResponse.json(
        {error: 'AI features are not enabled', success: false},
        {status: 200}
      )
    }

    if (!process.env.SANITY_API_TOKEN) {
      return NextResponse.json(
        {error: 'Sanity API token not configured'},
        {status: 500}
      )
    }

    // Fetch profile settings
    const profile = await sanityClient.fetch(
      `*[_type == "profile"][0]{
        company_name,
        contact_information,
        "settings": settings {
          aiContentAutomation {
            enabled,
            frequency,
            contentStyle,
            wordCount,
            autoPublish,
            generateImages,
            focusTopics,
            excludeTopics,
            notificationEmail
          }
        }
      }`
    )

    if (!profile?.settings?.aiContentAutomation?.enabled) {
      return NextResponse.json(
        {message: 'AI content automation is not enabled', success: false},
        {status: 200}
      )
    }

    const automation = profile.settings.aiContentAutomation

    // Fetch existing blog posts to avoid duplicates (only most recent 10)
    const existingPosts = await sanityClient.fetch(
      `*[_type == "post"] | order(publishedAt desc) [0...10] {title, "slug": slug.current}`
    )
    const existingTopics = existingPosts.map((post: any) => post.title)

    // Fetch services for context
    const services = await sanityClient.fetch(
      `*[_type == "service"]{title, excerpt}`
    )

    // Generate topic
    const topicResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/ai/generate-topics`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        businessProfile: {
          company_name: profile.company_name,
        },
        services,
        existingTopics,
        focusTopics: automation.focusTopics || [],
        excludeTopics: automation.excludeTopics || [],
        count: 1,
      }),
    })

    if (!topicResponse.ok) {
      throw new Error('Failed to generate topic')
    }

    const {topics} = await topicResponse.json()
    const topic = topics[0]

    if (!topic) {
      throw new Error('No topic generated')
    }

    // Prepare related articles for internal linking (max 10 most recent)
    const relatedArticles = existingPosts.slice(0, 10).map((post: any) => ({
      title: post.title,
      slug: post.slug,
    }))

    // Generate blog post
    const postResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/ai/generate-blog-post`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        topic: topic.title,
        keywords: topic.keywords || [],
        style: automation.contentStyle || 'professional',
        wordCount: automation.wordCount || 'medium',
        businessProfile: {
          company_name: profile.company_name,
        },
        generateImage: automation.generateImages !== false,
        relatedArticles,
      }),
    })

    if (!postResponse.ok) {
      throw new Error('Failed to generate blog post')
    }

    const postData = await postResponse.json()

    // Upload image to Sanity if generated
    let mainImage = null
    if (postData.imageAsset?.imageUrl) {
      try {
        const imageBuffer = await fetch(postData.imageAsset.imageUrl).then((r) => r.arrayBuffer())
        const imageAsset = await sanityClient.assets.upload('image', Buffer.from(imageBuffer), {
          filename: `ai-generated-${Date.now()}.png`,
        })
        
        mainImage = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset._id,
          },
          altText: `Featured image for ${postData.title}`,
        }
      } catch (error) {
        console.error('Image upload failed:', error)
      }
    }

    // Create slug from title
    const slugBase = postData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Ensure unique slug
    let slug = slugBase
    let counter = 1
    while (existingPosts.some((p: any) => p.slug === slug)) {
      slug = `${slugBase}-${counter}`
      counter++
    }

    // Create post in Sanity
    const newPost = {
      _type: 'post',
      title: postData.title,
      slug: {
        _type: 'slug',
        current: slug,
      },
      excerpt: postData.excerpt,
      body: postData.body,
      publishedAt: new Date().toISOString(),
      mainImage,
      seo: {
        _type: 'seo',
        metaTitle: postData.seo.metaTitle,
        metaDescription: postData.seo.metaDescription,
      },
    }

    const createdPost = await sanityClient.create(newPost)

    // Publish if auto-publish is enabled
    if (automation.autoPublish) {
      // Remove drafts. prefix if exists
      const publishId = createdPost._id.replace('drafts.', '')
      
      // Fetch the draft
      const draft = await sanityClient.getDocument(`drafts.${publishId}`)
      
      if (draft) {
        // Create published version
        await sanityClient.createOrReplace({
          ...draft,
          _id: publishId,
        })
        
        // Delete draft
        await sanityClient.delete(`drafts.${publishId}`)
      }
    }

    // Send notification email if configured
    if (automation.notificationEmail || profile.contact_information?.email) {
      const notificationEmail = automation.notificationEmail || profile.contact_information.email
      
      try {
        // Use Postmark if configured
        if (process.env.POSTMARK_API_KEY) {
          await fetch('https://api.postmarkapp.com/email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Postmark-Server-Token': process.env.POSTMARK_API_KEY,
            },
            body: JSON.stringify({
              From: process.env.POSTMARK_FROM_EMAIL || notificationEmail,
              To: notificationEmail,
              Subject: `New Blog Post ${automation.autoPublish ? 'Published' : 'Created'}: ${postData.title}`,
              TextBody: `A new blog post has been ${automation.autoPublish ? 'published' : 'created as a draft'}.

Title: ${postData.title}
Status: ${automation.autoPublish ? 'Published' : 'Draft'}
View in Sanity Studio: ${process.env.SANITY_STUDIO_WEBSITE_URL || 'https://your-studio.sanity.studio'}/desk/post;${createdPost._id}

${!automation.autoPublish ? 'The post is currently in draft status. Please review and publish it when ready.' : ''}`,
            }),
          })
        }
      } catch (error) {
        console.error('Failed to send notification email:', error)
      }
    }

    return NextResponse.json({
      success: true,
      post: {
        _id: createdPost._id,
        title: postData.title,
        slug,
        published: automation.autoPublish,
      },
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate blog post',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      {status: 500}
    )
  }
}
