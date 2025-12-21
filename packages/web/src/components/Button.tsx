'use client'

import Link from 'next/link'
import {cn} from '@/lib/utils'
import {useState} from 'react'
import {resolveColor} from '@/lib/utils/resolveColor'

interface ButtonProps {
  data: {
    text?: string
    linkType?: 'internal' | 'external' | 'path'
    internalLink?: {
      _type: string
      title?: string
      slug: string
    }
    internalPath?: string
    externalUrl?: string
    newTab?: boolean
    bgColorRef?: string
    bgCustomColor?: {hex?: string}
    textColorRef?: string
    textCustomColor?: {hex?: string}
    borderColorRef?: string
    borderCustomColor?: {hex?: string}
    hoverBgColorRef?: string
    hoverBgCustomColor?: {hex?: string}
    hoverTextColorRef?: string
    hoverTextCustomColor?: {hex?: string}
  }
  appearance?: {
    mainColors?: {
      primaryColor?: {hex?: string}
      secondaryColor?: {hex?: string}
      accentColor?: {hex?: string}
      neutralColor?: {hex?: string}
      websiteTextColor?: {hex?: string}
      websiteHeadingColor?: {hex?: string}
      buttonBackgroundColor?: {hex?: string}
      buttonTextColor?: {hex?: string}
    }
  }
  variant?: 'primary' | 'secondary'
  className?: string
}

export default function Button({ data, appearance, variant = 'primary', className }: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  if (!data?.text) return null

  const href = 
    data.linkType === 'internal' && data.internalLink
      ? data.internalLink._type === 'home'
        ? '/'
        : data.internalLink._type === 'blogIndex'
        ? '/blog'
        : `/${data.internalLink._type}/${data.internalLink.slug}`
      : data.linkType === 'path' && data.internalPath
      ? data.internalPath
      : data.externalUrl || '#'

  const baseClasses = 'inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantClasses = {
    primary: 'bg-black text-white hover:bg-gray-800 focus:ring-black',
    secondary: 'bg-white text-black border-2 border-black hover:bg-gray-100 focus:ring-black',
  }

  // Resolve colors from appearance or custom
  const bgColor = resolveColor(data.bgColorRef, data.bgCustomColor, appearance)
  const textColor = resolveColor(data.textColorRef, data.textCustomColor, appearance)
  const borderColor = resolveColor(data.borderColorRef, data.borderCustomColor, appearance)
  const hoverBgColor = resolveColor(data.hoverBgColorRef, data.hoverBgCustomColor, appearance)
  const hoverTextColor = resolveColor(data.hoverTextColorRef, data.hoverTextCustomColor, appearance)

  const hasCustomColors = bgColor || textColor || borderColor
  
  const customStyle = hasCustomColors ? {
    backgroundColor: isHovered && hoverBgColor ? hoverBgColor : bgColor,
    color: isHovered && hoverTextColor ? hoverTextColor : textColor,
    borderColor: borderColor,
    borderWidth: borderColor ? '2px' : undefined,
    borderStyle: borderColor ? 'solid' : undefined,
  } : undefined

  const Component = data.linkType === 'external' ? 'a' : Link

  return (
    <Component
      href={href}
      className={cn(baseClasses, !hasCustomColors && variantClasses[variant], className)}
      style={customStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...(data.newTab && {target: '_blank', rel: 'noopener noreferrer'})}
    >
      {data.text}
    </Component>
  )
}
