import SectionHeader from '@/components/SectionHeader'
import Button from '@/components/Button'
import Image from 'next/image'
import {urlFor} from '@/lib/sanity/image'
import {cn} from '@/lib/utils'
import {resolveColor} from '@/lib/utils/resolveColor'
import PortableTextBlock from '@/components/PortableTextBlock'

interface FeaturedGridProps {
  data: {
    content?: any[]
    layout?: 'textOverlay' | 'textOnly' | 'textBelow' | 'imageOnly'
    textAlign?: 'left' | 'center' | 'right'
    primaryButton?: any
    secondaryButton?: any
    blocks?: Array<{
      _key: string
      image?: any
      heading?: string
      content?: any[]
      button?: any
    }>
    columns?: number
    gap?: 'none' | 'small' | 'medium' | 'large'
    imageHeight?: 'small' | 'medium' | 'large' | 'xlarge' | 'auto'
    headingColorRef?: string
    headingCustomColor?: {hex: string}
    contentColorRef?: string
    contentCustomColor?: {hex: string}
  }
  appearance?: any
}

export default function FeaturedGrid({data, appearance}: FeaturedGridProps) {
  const {
    content,
    layout = 'textBelow',
    textAlign = 'center',
    primaryButton,
    secondaryButton,
    blocks = [],
    columns = 3,
    gap = 'medium',
    imageHeight = 'medium',
    headingColorRef,
    headingCustomColor,
    contentColorRef,
    contentCustomColor,
  } = data

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  const gapClasses = {
    none: 'gap-0',
    small: 'gap-4',
    medium: 'gap-8',
    large: 'gap-12',
  }

  const heightClasses = {
    small: 'h-[200px]',
    medium: 'h-64',
    large: 'h-80',
    xlarge: 'h-[400px]',
    auto: 'h-auto',
  }

  return (
    <div>
      {/* Section Header */}
      {content && (
        <SectionHeader
          content={content}
          primaryButton={primaryButton}
          secondaryButton={secondaryButton}
          align={textAlign}
          contentClassName="prose prose-lg mx-auto max-w-3xl [&>*:first-child]:text-3xl [&>*:first-child]:font-bold [&>*:first-child]:tracking-tight md:[&>*:first-child]:text-4xl"
          buttonsClassName="mt-8 flex flex-wrap gap-4 justify-center"
        />
      )}

      {/* Feature Blocks Grid */}
      <div className={cn('grid mt-12', gridCols[columns as keyof typeof gridCols] || gridCols[3], gapClasses[gap as keyof typeof gapClasses] || gapClasses.medium)}>
        {blocks.map((block) => {
          // Text Overlay on Image
          if (layout === 'textOverlay') {
            return (
              <div key={block._key} className="relative overflow-hidden group">
                {block.image && (
                  <Image
                    src={urlFor(block.image).width(600).height(400).url()}
                    alt={block.image.altText || block.image.asset?.altText || block.heading || ''}
                    width={600}
                    height={400}
                    className={cn('w-full object-cover transition-transform duration-300 group-hover:scale-105', heightClasses[imageHeight as keyof typeof heightClasses] || heightClasses.medium)}
                    placeholder="blur"
                    blurDataURL={block.image.asset?.metadata?.lqip}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                  {block.heading && (
                    <h3 
                      className="text-2xl font-bold mb-2"
                      style={{color: resolveColor(headingColorRef, headingCustomColor, appearance)}}
                    >
                      {block.heading}
                    </h3>
                  )}
                  {block.content && (
                    <div 
                      className="prose prose-invert prose-sm"
                      style={{color: resolveColor(contentColorRef, contentCustomColor, appearance)}}
                    >
                      <PortableTextBlock value={block.content} appearance={appearance} />
                    </div>
                  )}
                  {block.button && (
                    <div className="mt-4">
                      <Button data={block.button} />
                    </div>
                  )}
                </div>
              </div>
            )
          }

          // Text Only
          if (layout === 'textOnly') {
            return (
              <div key={block._key} className="text-center">
                {block.heading && (
                  <h3 
                    className="text-2xl font-bold mb-4"
                    style={{color: resolveColor(headingColorRef, headingCustomColor, appearance)}}
                  >
                    {block.heading}
                  </h3>
                )}
                {block.content && (
                  <div 
                    className="prose prose-lg mx-auto"
                    style={{color: resolveColor(contentColorRef, contentCustomColor, appearance)}}
                  >
                    <PortableTextBlock value={block.content} appearance={appearance} />
                  </div>
                )}
                {block.button && (
                  <div className="mt-6">
                    <Button data={block.button} />
                  </div>
                )}
              </div>
            )
          }

          // Image Only
          if (layout === 'imageOnly') {
            return (
              <div key={block._key} className="rounded-lg overflow-hidden">
                {block.image && (
                  <Image
                    src={urlFor(block.image).width(600).height(400).url()}
                    alt={block.image.altText || block.image.asset?.altText || block.heading || ''}
                    width={600}
                    height={400}
                    className={cn('w-full object-cover transition-transform duration-300 hover:scale-105', heightClasses[imageHeight as keyof typeof heightClasses] || heightClasses.medium)}
                    placeholder="blur"
                    blurDataURL={block.image.asset?.metadata?.lqip}
                  />
                )}
              </div>
            )
          }

          // Text Below Image (default)
          return (
            <div key={block._key} className="text-center">
              {block.image && (
                <div className="mb-6 rounded-lg overflow-hidden">
                  <Image
                    src={urlFor(block.image).width(600).height(400).url()}
                    alt={block.image.altText || block.image.asset?.altText || block.heading || ''}
                    width={600}
                    height={400}
                    className={cn('w-full object-cover', heightClasses[imageHeight as keyof typeof heightClasses] || heightClasses.medium)}
                    placeholder="blur"
                    blurDataURL={block.image.asset?.metadata?.lqip}
                  />
                </div>
              )}
              {block.heading && (
                <h3 
                  className="text-2xl font-bold mb-4"
                  style={{color: resolveColor(headingColorRef, headingCustomColor, appearance)}}
                >
                  {block.heading}
                </h3>
              )}
              {block.content && (
                <div 
                  className="prose prose-lg mx-auto"
                  style={{color: resolveColor(contentColorRef, contentCustomColor, appearance)}}
                >
                  <PortableTextBlock value={block.content} appearance={appearance} />
                </div>
              )}
              {block.button && (
                <div className="mt-6">
                  <Button data={block.button} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
