'use client'

import {PortableText, PortableTextReactComponents} from '@portabletext/react'
import {getPortableTextComponents} from './PortableTextComponents'
import {useMemo} from 'react'

interface PortableTextBlockProps {
  value: any
  className?: string
  components?: Partial<PortableTextReactComponents>
  appearance?: any // Optional appearance prop from server component
}

export default function PortableTextBlock({
  value,
  className = '',
  components,
  appearance,
}: PortableTextBlockProps) {
  // Memoize components to recreate when appearance changes
  const portableTextComponents = useMemo(() => {
    return {...getPortableTextComponents(appearance), ...components}
  }, [appearance, components])

  if (!value) return null

  // Ensure value is an array - portable text expects an array of blocks
  const content = Array.isArray(value) ? value : [value]
  
  // Filter out any null/undefined values and ensure all items are valid objects
  const validContent = content.filter(item => item && typeof item === 'object')
  
  if (validContent.length === 0) return null

  return (
    <div className={className}>
      <PortableText
        value={validContent}
        components={portableTextComponents}
      />
    </div>
  )
}
