import Image from 'next/image'
import {urlFor} from '@/lib/sanity/image'
import Button from '@/components/Button'
import SectionHeader from '@/components/SectionHeader'
import {cn} from '@/lib/utils'

interface ContentProps {
  data: {
    content?: any[]
    image?: any
    primaryButton?: any
    layout?: 'imageLeft' | 'imageRight' | 'imageTop' | 'imageBottom' | 'fullWidthImage' | 'cards' | 'textOnly'
    textAlign?: 'left' | 'center' | 'right'
  }
}

export default function Content({ data }: ContentProps) {
  const { 
    content, 
    image, 
    layout = 'imageLeft', 
    primaryButton, 
    textAlign = 'left'
  } = data

  // Full width image with text overlay
  if (layout === 'fullWidthImage') {
    return (
      <div className="relative py-32 md:py-48">
        {image && (
          <>
            <div className="absolute inset-0">
              <Image
                src={urlFor(image).width(1920).height(1080).url()}
                alt={image.altText || image.asset?.altText || ''}
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL={image.asset?.metadata?.lqip}
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>
          </>
        )}
        <div className="container relative z-10 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <SectionHeader
              content={content}
              primaryButton={primaryButton}
              contentClassName="prose prose-lg prose-invert max-w-none [&>*:first-child]:text-4xl [&>*:first-child]:font-bold [&>*:first-child]:tracking-tight md:[&>*:first-child]:text-5xl lg:[&>*:first-child]:text-6xl"
              buttonsClassName="mt-8"
              align={textAlign}
            />
          </div>
        </div>
      </div>
    )
  }

  // Cards layout - content and image as side-by-side cards
  if (layout === 'cards') {
    return (
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-10">
          <SectionHeader
            content={content}
            primaryButton={primaryButton}
            contentClassName="prose max-w-none [&>*:first-child]:text-2xl [&>*:first-child]:font-bold [&>*:first-child]:tracking-tight md:[&>*:first-child]:text-3xl"
            buttonsClassName="mt-6"
            align={textAlign}
          />
        </div>
        {image && (
          <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={urlFor(image).width(800).height(600).url()}
              alt={image.asset?.altText || ''}
              width={800}
              height={600}
              className="w-full h-full object-cover"
              placeholder="blur"
              blurDataURL={image.asset?.metadata?.lqip}
            />
          </div>
        )}
      </div>
    )
  }

  // Standard layouts
  const layoutClasses = {
    imageLeft: 'md:flex-row',
    imageRight: 'md:flex-row-reverse',
    imageTop: 'flex-col',
    imageBottom: 'flex-col-reverse',
    textOnly: 'flex-col',
    fullWidthImage: 'flex-col', // fallback
    cards: 'flex-col', // fallback
  }

  return (
    <div className={cn('flex flex-col gap-8 md:gap-12 items-center', layoutClasses[layout])}>
      {image && layout !== 'textOnly' && (
        <div className="w-full md:w-1/2">
          <Image
            src={urlFor(image).width(800).height(600).url()}
            alt={image.asset?.altText || ''}
            width={800}
            height={600}
            className="rounded-lg"
            placeholder="blur"
            blurDataURL={image.asset?.metadata?.lqip}
          />
        </div>
      )}

      <div className="w-full md:w-1/2">
        <SectionHeader
          content={content}
          primaryButton={primaryButton}
          contentClassName="prose max-w-none [&>*:first-child]:text-3xl [&>*:first-child]:font-bold [&>*:first-child]:tracking-tight sm:[&>*:first-child]:text-4xl"
          buttonsClassName="mt-8"
          align={textAlign}
        />
      </div>
    </div>
  )
}
