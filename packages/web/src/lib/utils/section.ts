import type React from 'react'
import {resolveColor} from './resolveColor'

export const getSectionSpacing = (
  paddingTop?: string,
  paddingBottom?: string,
  paddingTopCustom?: string,
  paddingBottomCustom?: string
) => {
  const spacingMap = {
    none: '',
    small: 'py-8 md:py-12',
    medium: 'py-16 md:py-24',
    large: 'py-24 md:py-32',
    xlarge: 'py-32 md:py-48',
  }

  // Handle custom padding - return inline style object
  if (paddingTop === 'custom' || paddingBottom === 'custom') {
    return null // Signal to use inline styles
  }
  
  // Default to medium if both are undefined
  if (!paddingTop && !paddingBottom) {
    return spacingMap.medium
  }
  
  // If same top/bottom and not custom, use shorthand
  if (paddingTop === paddingBottom && paddingTop) {
    return spacingMap[paddingTop as keyof typeof spacingMap] || ''
  }
  
  // Different top/bottom, use separate classes
  const topMap = {
    none: '',
    small: 'pt-8 md:pt-12',
    medium: 'pt-16 md:pt-24',
    large: 'pt-24 md:pt-32',
    xlarge: 'pt-32 md:pt-48',
  }
  const bottomMap = {
    none: '',
    small: 'pb-8 md:pb-12',
    medium: 'pb-16 md:pb-24',
    large: 'pb-24 md:pb-32',
    xlarge: 'pb-32 md:pb-48',
  }
  
  const topClass = topMap[paddingTop as keyof typeof topMap] ?? topMap.medium
  const bottomClass = bottomMap[paddingBottom as keyof typeof bottomMap] ?? bottomMap.medium
  
  return `${topClass} ${bottomClass}`.trim()
}

export const getCustomSpacing = (
  paddingTop?: string,
  paddingBottom?: string,
  paddingTopCustom?: string,
  paddingBottomCustom?: string
): React.CSSProperties => {
  const styles: React.CSSProperties = {}
  
  if (paddingTop === 'custom' && paddingTopCustom) {
    styles.paddingTop = paddingTopCustom
  }
  if (paddingBottom === 'custom' && paddingBottomCustom) {
    styles.paddingBottom = paddingBottomCustom
  }
  
  return styles
}

export const getContainerWidth = (width?: string) => {
  const widthMap = {
    narrow: 'max-w-4xl mx-auto',
    default: 'container mx-auto',
    wide: 'max-w-screen-2xl mx-auto',
    full: 'max-w-none',
  }
  return widthMap[width as keyof typeof widthMap] || widthMap.default
}

export const getBackgroundStyle = (
  backgroundType?: string,
  backgroundColorRef?: string,
  backgroundCustomColor?: {hex: string},
  backgroundGradient?: {
    fromRef?: string
    fromCustom?: {hex: string}
    toRef?: string
    toCustom?: {hex: string}
    direction: string
  },
  backgroundImage?: {
    image: any
    overlayColorRef?: string
    overlayCustomColor?: {hex: string}
    overlayOpacity?: number
  },
  textColorRef?: string,
  textCustomColor?: {hex: string},
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
) => {
  const style: React.CSSProperties = {}
  
  // Handle background based on type
  if (backgroundType === 'color') {
    const bgColor = resolveColor(backgroundColorRef, backgroundCustomColor, appearance)
    if (bgColor) {
      style.backgroundColor = bgColor
    }
  } else if (backgroundType === 'gradient' && backgroundGradient) {
    const fromColor = resolveColor(backgroundGradient.fromRef, backgroundGradient.fromCustom, appearance)
    const toColor = resolveColor(backgroundGradient.toRef, backgroundGradient.toCustom, appearance)
    
    if (fromColor && toColor) {
      const directionMap: Record<string, string> = {
        'to-r': 'to right',
        'to-br': 'to bottom right',
        'to-b': 'to bottom',
        'to-bl': 'to bottom left',
        'to-l': 'to left',
      }
      style.backgroundImage = `linear-gradient(${directionMap[backgroundGradient.direction] || 'to right'}, ${fromColor}, ${toColor})`
    }
  } else if (backgroundType === 'image' && backgroundImage?.image) {
    // Background image will be handled separately in PageBuilder with Image component
    style.position = 'relative'
  }
  
  const textColor = resolveColor(textColorRef, textCustomColor, appearance)
  if (textColor) {
    Object.assign(style, {
      color: textColor,
      '--section-text-color': textColor
    } as React.CSSProperties & Record<string, string>)
  }
  
  return style
}

