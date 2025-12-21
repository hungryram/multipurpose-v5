import React, {useState} from 'react'
import {Stack, Button, Card, Text, Spinner} from '@sanity/ui'
import {ObjectInputProps, set, useFormValue} from 'sanity'

export function SEOMetaGenerator(props: ObjectInputProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get the document to extract content from
  const document: any = useFormValue([])
  
  // Check if AI features are enabled (only SANITY_STUDIO_ prefix works in Studio)
  const enableAI = process.env.SANITY_STUDIO_ENABLE_AI_FEATURES === 'true'

  // If AI not enabled, just render default
  if (!enableAI) {
    return props.renderDefault(props)
  }
  
  const handleGenerate = async () => {
    setLoading(true)
    setError(null)

    try {
      // Extract content from the document
      let content = ''
      let pageTitle = document?.title || ''
      let pageType = document?._type || 'page'

      // Try to get content from different possible fields
      if (document?.body) {
        content = JSON.stringify(document.body)
      } else if (document?.content) {
        content = JSON.stringify(document.content)
      } else if (document?.pageBuilder) {
        content = JSON.stringify(document.pageBuilder)
      } else if (document?.excerpt) {
        content = document.excerpt
      }

      if (!content && !pageTitle) {
        setError(
          'No content found. Please add content to the page first (title, body, or page builder blocks).'
        )
        setLoading(false)
        return
      }

      // Get website URL from environment or use localhost
      const websiteUrl =
        process.env.SANITY_STUDIO_WEBSITE_URL || 'http://localhost:3000'

      const response = await fetch(`${websiteUrl}/api/ai/generate-seo-meta`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({content, pageTitle, pageType}),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate SEO metadata')
      }

      const data = await response.json()

      // Update both metaTitle and metaDescription
      if (data.metaTitle || data.metaDescription) {
        const currentValue = props.value || {}
        const newValue = {
          ...currentValue,
          ...(data.metaTitle && {metaTitle: data.metaTitle}),
          ...(data.metaDescription && {metaDescription: data.metaDescription}),
        }
        props.onChange(set(newValue))
      }
    } catch (err: any) {
      console.error('SEO meta generation error:', err)
      setError(err.message || 'Failed to generate SEO metadata')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Stack space={3}>
      <Card padding={3} radius={2} shadow={1} tone="primary">
        <Stack space={3}>
          <Button
            mode="default"
            tone="primary"
            text="✨ Generate SEO Meta from Content"
            onClick={handleGenerate}
            disabled={loading}
            icon={loading ? Spinner : undefined}
            style={{width: '100%'}}
          />
          <Text size={1} muted>
            AI will analyze your page content and generate optimized meta title and description
          </Text>
          {error && (
            <Text size={1} style={{color: 'red'}}>
              {error}
            </Text>
          )}
        </Stack>
      </Card>
      {props.renderDefault(props)}
    </Stack>
  )
}
