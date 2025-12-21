import Image from 'next/image'
import {urlFor} from '@/lib/sanity/image'
import SectionHeader from '@/components/SectionHeader'
import {cn} from '@/lib/utils'

interface HeroProps {
  data: {
    content?: any[]
    image?: any
    primaryButton?: any
    secondaryButton?: any
    height?: 'small' | 'medium' | 'large' | 'full'
    textAlign?: 'left' | 'center' | 'right'
    overlayColor?: {
      rgb?: {r: number; g: number; b: number; a: number}
    }
  }
}

const heightClasses = {
  small: 'min-h-[400px]',
  medium: 'min-h-[600px]',
  large: 'min-h-[800px]',
  full: 'min-h-screen',
}

const alignClasses = {
  left: 'text-left items-start',
  center: 'text-center items-center',
  right: 'text-right items-end',
}

export default function Hero({ data }: HeroProps) {
  const { content, image, primaryButton, secondaryButton, height = 'large', textAlign = 'center', overlayColor } = data

  // Build rgba string from overlayColor
  const overlayStyle = overlayColor?.rgb 
    ? `rgba(${overlayColor.rgb.r}, ${overlayColor.rgb.g}, ${overlayColor.rgb.b}, ${overlayColor.rgb.a})`
    : 'rgba(0, 0, 0, 0.4)' // Default: black with 40% opacity

  return (
    <div className={cn('relative flex items-center justify-center', heightClasses[height])}>
      {image && (
        <>
          <div className="absolute inset-0">
            <Image
              src={urlFor(image).width(1920).height(1080).url()}
              alt={image.altText || image.asset?.altText || ''}
              fill
              className="object-cover"
              priority
              placeholder="blur"
              blurDataURL={image.asset?.metadata?.lqip}
            />
          </div>
          <div 
            className="absolute inset-0 z-[1]" 
            style={{ backgroundColor: overlayStyle }}
          />
        </>
      )}

      <div className={cn('container relative z-10 px-4 flex flex-col', alignClasses[textAlign])}>
        <SectionHeader
          content={content}
          primaryButton={primaryButton}
          secondaryButton={secondaryButton}
          contentClassName="prose prose-lg prose-invert max-w-4xl [&>*:first-child]:text-4xl [&>*:first-child]:font-bold [&>*:first-child]:tracking-tight sm:[&>*:first-child]:text-5xl md:[&>*:first-child]:text-6xl lg:[&>*:first-child]:text-7xl"
          buttonsClassName="mt-10 flex flex-wrap gap-4"
          align={textAlign}
        />
      </div>
    </div>
  )
}
