import Button from '@/components/Button'
import SectionHeader from '@/components/SectionHeader'
import Image from 'next/image'
import {urlFor} from '@/lib/sanity/image'
import {cn} from '@/lib/utils'

interface CtaSectionProps {
  data: {
    content?: any[]
    layout?: 'centered' | 'banner' | 'split' | 'card'
    image?: any
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

  // Banner layout - minimal height, horizontal buttons
  if (layout === 'banner') {
    return (
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <SectionHeader
            content={content}
            primaryButton={primaryButton}
            secondaryButton={secondaryButton}
            contentClassName="prose prose-lg [&>*:first-child]:text-2xl [&>*:first-child]:font-bold [&>*:first-child]:tracking-tight md:[&>*:first-child]:text-3xl [&>*:first-child]:mb-2"
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
        <div className="flex-1">
          <SectionHeader
            content={content}
            primaryButton={primaryButton}
            secondaryButton={secondaryButton}
            contentClassName="prose prose-lg max-w-none [&>*:first-child]:text-3xl [&>*:first-child]:font-bold [&>*:first-child]:tracking-tight md:[&>*:first-child]:text-4xl lg:[&>*:first-child]:text-5xl"
            buttonsClassName="mt-8 flex flex-wrap gap-4"
            align={textAlign}
          />
        </div>
        {image && (
          <div className="flex-1 w-full">
            <Image
              src={urlFor(image).width(800).height(600).url()}
              alt={image.altText || image.asset?.altText || ''}
              width={800}
              height={600}
              className="rounded-lg w-full"
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
          contentClassName="prose prose-lg mx-auto [&>*:first-child]:text-3xl [&>*:first-child]:font-bold [&>*:first-child]:tracking-tight sm:[&>*:first-child]:text-4xl md:[&>*:first-child]:text-5xl"
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
        contentClassName="prose prose-lg mx-auto [&>*:first-child]:text-3xl [&>*:first-child]:font-bold [&>*:first-child]:tracking-tight sm:[&>*:first-child]:text-4xl md:[&>*:first-child]:text-5xl"
        align={textAlign}
      />
    </div>
  )
}
