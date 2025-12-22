import {Card, Button, Stack, Text, TextInput, Select, Flex, Label, Spinner} from '@sanity/ui'
import {useState} from 'react'
import {set, unset, useClient} from 'sanity'
import {ImageIcon} from '@sanity/icons'

interface ImageGeneratorProps {
  value?: {asset?: {_ref: string}}
  onChange: (patch: any) => void
  schemaType: any
}

export function ImageGenerator({value, onChange, schemaType}: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('natural')
  const [quality, setQuality] = useState('standard')
  const [size, setSize] = useState('1024x1024')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const client = useClient({apiVersion: '2024-01-01'})
  const websiteUrl = process.env.SANITY_STUDIO_WEBSITE_URL || 'http://localhost:3000'

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      // Generate image (server will handle download and upload to Sanity)
      const generateResponse = await fetch(`${websiteUrl}/api/ai/generate-image`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({prompt, style, quality, size}),
      })

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${generateResponse.status}: ${generateResponse.statusText}`)
      }

      const {asset, revisedPrompt} = await generateResponse.json()

      // Update field value with the asset reference from the server
      onChange(
        set({
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._ref,
          },
        })
      )

      setPrompt('')
    } catch (err) {
      console.error('Error generating image:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate image')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card padding={3} border radius={2}>
      <Stack space={3}>
        <Flex align="center" gap={2}>
          <ImageIcon />
          <Text weight="semibold">AI Image Generator</Text>
        </Flex>

        <Stack space={3}>
          <Stack space={2}>
            <Label size={1}>Describe the image</Label>
            <TextInput
              placeholder="e.g., Modern office workspace with natural lighting"
              value={prompt}
              onChange={(e) => setPrompt(e.currentTarget.value)}
              disabled={isGenerating}
            />
          </Stack>

          <Flex gap={2}>
            <Stack space={2} flex={1}>
              <Label size={1}>Style</Label>
              <Select
                value={style}
                onChange={(e) => setStyle(e.currentTarget.value)}
                disabled={isGenerating}
              >
                <option value="natural">Natural</option>
                <option value="photographic">Photographic</option>
                <option value="digital-art">Digital Art</option>
                <option value="illustration">Illustration</option>
                <option value="minimalist">Minimalist</option>
                <option value="abstract">Abstract</option>
              </Select>
            </Stack>

            <Stack space={2} flex={1}>
              <Label size={1}>Quality</Label>
              <Select
                value={quality}
                onChange={(e) => setQuality(e.currentTarget.value)}
                disabled={isGenerating}
              >
                <option value="standard">Standard</option>
                <option value="hd">HD</option>
              </Select>
            </Stack>
          </Flex>

          <Stack space={2}>
            <Label size={1}>Size</Label>
            <Select
              value={size}
              onChange={(e) => setSize(e.currentTarget.value)}
              disabled={isGenerating}
            >
              <option value="1024x1024">Square (1024x1024)</option>
              <option value="1792x1024">Landscape (1792x1024)</option>
              <option value="1024x1792">Portrait (1024x1792)</option>
            </Select>
          </Stack>

          {error && (
            <Card padding={3} tone="critical" radius={2}>
              <Text size={1}>{error}</Text>
            </Card>
          )}

          <Button
            text={isGenerating ? 'Generating...' : 'Generate Image'}
            onClick={generateImage}
            tone="primary"
            disabled={isGenerating || !prompt.trim()}
            icon={isGenerating ? Spinner : ImageIcon}
          />
        </Stack>
      </Stack>
    </Card>
  )
}
