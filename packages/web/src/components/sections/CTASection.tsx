import SectionHeader from '@/components/SectionHeader'
import Image from 'next/image'
import {urlFor} from '@/lib/sanity/image'
import {cn} from '@/lib/utils'

interface CtaSectionProps {
  data: {
    content?: any[]
    layout?: 'centered' | 'banner' | 'split' | 'card'
    image?: any
    imageSize?: string
    imageSizeCustom?: number
    imageFit?: 'cover' | 'contain' | 'fill'
    imageHeight?: string
    imageHeightCustom?: string
    primaryButton?: any
    secondaryButton?: any
    backgroundColor?: {hex: string}
    textColor?: {hex: string}
    textAlign?: 'left' | 'center' | 'right'
    reverseColumn?: boolean
    spacing?: 'small' | 'medium' | 'large' | 'xlarge'
  }
}

export default function CtaSection({ data }: CtaSectionProps) {
  const { 
    content, 
    layout = 'centered', 
    image,
    imageSize = '50',
    imageSizeCustom,
    imageFit = 'cover',
    imageHeight = '500',
    imageHeightCustom,
    primaryButton, 
    secondaryButton, 
    backgroundColor, 
    textColor, 
    textAlign = 'center',
    reverseColumn = false,
    spacing = 'medium'
  } = data

  // Map spacing to Tailwind gap classes
  const gapClasses = {
    small: 'gap-4 md:gap-6',
    medium: 'gap-8 md:gap-12',
    large: 'gap-12 md:gap-16',
    xlarge: 'gap-16 md:gap-24'
  }

  // Calculate image width percentage
  const getImageWidth = () => {
    if (imageSize === 'custom' && imageSizeCustom) {
      return imageSizeCustom
    }
    return parseInt(imageSize) || 50
  }

  const imageWidth = getImageWidth()
  const textWidth = 100 - imageWidth

  // Calculate image height
  const getImageHeight = () => {
    if (imageHeight === 'custom' && imageHeightCustom) {
      return imageHeightCustom
    }
    return `${imageHeight}px`
  }

  // Banner layout - minimal height, horizontal buttons
  if (layout === 'banner') {
    return (
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <SectionHeader
            content={content}
            primaryButton={primaryButton}
            secondaryButton={secondaryButton}
            contentClassName="prose prose-lg"
            buttonsClassName="mt-4 flex flex-wrap gap-4 shrink-0"
            align={textAlign}
          />
        </div>
      </div>
    )
  }

  // Split layout - text and image side by side
  if (layout === 'split') {
    return (
      <div className={cn(
        "flex flex-col md:flex-row items-center",
        gapClasses[spacing],
        reverseColumn && "md:flex-row-reverse"
      )}>
        <div 
          className="w-full"
          style={{ flexBasis: textWidth ? `${textWidth}%` : '50%' }}
        >
          <SectionHeader
            content={content}
            primaryButton={primaryButton}
            secondaryButton={secondaryButton}
            contentClassName="prose prose-lg max-w-none"
            buttonsClassName="mt-8 flex flex-wrap gap-4"
            align={textAlign}
          />
        </div>
        {image && (
          <div 
            className="w-full relative overflow-hidden rounded-lg min-h-100 md:min-h-0"
            style={{ 
              flexBasis: imageWidth ? `${imageWidth}%` : '50%',
              height: getImageHeight(),
            }}
          >
            <Image
              src={urlFor(image).width(1200).url()}
              alt={image.altText || image.asset?.altText || ''}
              fill
              className={cn(
                "rounded-lg",
                imageFit === 'cover' ? "object-cover" : "object-contain"
              )}
              placeholder="blur"
              blurDataURL={image.asset?.metadata?.lqip}
            />
          </div>
        )}
      </div>
    )
  }

  // Card layout - contained with background
  if (layout === 'card') {
    return (
      <div 
        className="max-w-4xl mx-auto rounded-2xl p-8 md:p-12 lg:p-16 shadow-xl text-center"
        style={{
          backgroundColor: backgroundColor?.hex || '#f9fafb',
          color: textColor?.hex,
        }}
      >
        <SectionHeader
          content={content}
          primaryButton={primaryButton}
          secondaryButton={secondaryButton}
          contentClassName="prose prose-lg mx-auto"
          align={textAlign}
        />
      </div>
    )
  }

  // Centered layout (default)
  return (
    <div>
      <SectionHeader
        content={content}
        primaryButton={primaryButton}
        secondaryButton={secondaryButton}
        contentClassName="prose prose-lg mx-auto"
        align={textAlign}
      />
    </div>
  )
}
