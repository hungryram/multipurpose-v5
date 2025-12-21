import React from 'react'
import {Stack, Button} from '@sanity/ui'
import {SlugInputProps, set} from 'sanity'

export function SlugGenerator(props: SlugInputProps) {
  const {value, onChange, schemaType} = props

  const handleGenerate = () => {
    const sourceField = schemaType.options?.source
    const document: any = props.document

    if (!sourceField || !document) return

    const sourceValue = document[sourceField as string]
    if (!sourceValue) return

    // Create URL-friendly slug
    const slug = sourceValue
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()

    onChange(set({_type: 'slug', current: slug}))
  }

  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      <Button
        mode="ghost"
        tone="primary"
        text="Generate from Title"
        onClick={handleGenerate}
        disabled={!props.document}
      />
    </Stack>
  )
}
