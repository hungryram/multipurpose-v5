'use client'

import {PortableText, PortableTextReactComponents} from '@portabletext/react'
import {portableTextComponents} from './PortableTextComponents'

interface PortableTextBlockProps {
  value: any
  className?: string
  components?: Partial<PortableTextReactComponents>
}

export default function PortableTextBlock({
  value,
  className = '',
  components,
}: PortableTextBlockProps) {
  if (!value) return null

  return (
    <div className={className}>
      <PortableText
        value={value}
        components={components || portableTextComponents}
      />
    </div>
  )
}
