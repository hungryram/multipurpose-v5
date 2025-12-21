import React, {useState} from 'react'
import {Stack, Button, Text, Spinner} from '@sanity/ui'
import {StringInputProps, set, useFormValue} from 'sanity'

export function AltTextGenerator(props: StringInputProps) {
  const {value, onChange, path} = props
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if AI features are enabled (only SANITY_STUDIO_ prefix works in Studio)
  const enableAI = process.env.SANITY_STUDIO_ENABLE_AI_FEATURES === 'true'

  // Get the parent image object (remove 'altText' from path to get image field)
  const parentPath = path.slice(0, -1)
  const imageObject: any = useFormValue(parentPath)

  // If AI not enabled, just render default
  if (!enableAI) {
    return props.renderDefault(props)
  }

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)

    try {
      // Get the asset reference from the image object
      const assetRef = imageObject?.asset?._ref

      if (!assetRef) {
        setError('No image uploaded yet. Please upload an image first.')
        setLoading(false)
        return
      }

      // Convert Sanity asset reference to CDN URL
      const projectId = process.env.SANITY_STUDIO_PROJECT_ID
      const dataset = process.env.SANITY_STUDIO_DATASET
      const assetId = assetRef.replace('image-', '').replace(/-(\w+)$/, '.$1')
      const imageUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${assetId}`

      // Get website URL from environment or use localhost
      const websiteUrl =
        process.env.SANITY_STUDIO_WEBSITE_URL || 'http://localhost:3000'

      const response = await fetch(`${websiteUrl}/api/ai/generate-alt-text`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({imageUrl}),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate alt text')
      }

      const data = await response.json()

      if (data.altText) {
        onChange(set(data.altText))
      }
    } catch (err: any) {
      console.error('Alt text generation error:', err)
      setError(err.message || 'Failed to generate alt text')
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
        text="✨ Generate Alt Text with AI"
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
