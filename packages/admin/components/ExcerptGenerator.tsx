import React, {useState} from 'react'
import {Stack, Button, Text, Spinner} from '@sanity/ui'
import {TextInputProps, set, useFormValue} from 'sanity'

export function ExcerptGenerator(props: TextInputProps) {
  const {onChange} = props
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get the document to extract content from
  const document: any = useFormValue([])

  // Check if AI features are enabled
  const enableAI = process.env.SANITY_STUDIO_ENABLE_AI_FEATURES === 'true'

  // If AI not enabled, just render default
  if (!enableAI) {
    return props.renderDefault(props)
  }

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)

    try {
      const title = document?.title || ''
      const content = document?.body || document?.content || ''

      if (!title && !content) {
        setError('Please add a title or content first.')
        setLoading(false)
        return
      }

      // Get website URL from environment
      const websiteUrl =
        process.env.SANITY_STUDIO_WEBSITE_URL || 'http://localhost:3000'

      const response = await fetch(`${websiteUrl}/api/ai/generate-excerpt`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title, content}),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate excerpt')
      }

      const data = await response.json()

      if (data.excerpt) {
        onChange(set(data.excerpt))
      }
    } catch (err: any) {
      console.error('Excerpt generation error:', err)
      setError(err.message || 'Failed to generate excerpt')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      <Button
        mode="ghost"
        tone="primary"
        text="✨ Generate Excerpt with AI"
        onClick={handleGenerate}
        disabled={loading}
        icon={loading ? Spinner : undefined}
      />
      {error && (
        <Text size={1} style={{color: 'red'}}>
          {error}
        </Text>
      )}
    </Stack>
  )
}
