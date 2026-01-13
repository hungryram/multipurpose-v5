'use client'

import {useState} from 'react'
import Image from 'next/image'
import {urlFor} from '@/lib/sanity/image'
import SectionHeader from '@/components/SectionHeader'

interface GalleryImage {
  _key: string
  asset: any
  alt: string
  caption?: string
}

interface GalleryProps {
  content?: any[]
  layout?: 'grid' | 'masonry' | 'carousel'
  images?: GalleryImage[]
  columns?: number
  aspectRatio?: string
  enableLightbox?: boolean
  backgroundColor?: {hex: string}
  textAlign?: 'left' | 'center' | 'right'
}

export default function Gallery({
  content,
  layout = 'grid',
  images = [],
  columns = 3,
  aspectRatio = '1/1',
  enableLightbox = true,
  backgroundColor,
  textAlign = 'center',
}: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!images?.length) return null

  const bgColor = backgroundColor?.hex || 'transparent'
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'md:grid-cols-2 lg:grid-cols-3'

  const openLightbox = (index: number) => {
    if (enableLightbox) {
      setLightboxIndex(index)
      document.body.style.overflow = 'hidden'
    }
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
    document.body.style.overflow = 'unset'
  }

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + images.length) % images.length)
    }
  }

  return (
    <section
      className="py-16 md:py-24"
      style={{backgroundColor: bgColor}}
    >
      <div className="container mx-auto px-4">
        <SectionHeader
          content={content}
          contentClassName="prose prose-lg max-w-3xl"
          align={textAlign}
        />

        <div className={`grid ${gridCols} gap-4`}>
          {images.map((image, index) => (
            <div
              key={image._key}
              className="relative overflow-hidden rounded-lg group cursor-pointer"
              style={{aspectRatio: aspectRatio !== 'auto' ? aspectRatio : undefined}}
              onClick={() => openLightbox(index)}
            >
              <Image
                src={urlFor(image).width(800).height(800).url()}
                alt={image.alt}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              {image.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-black/70 text-white p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-sm">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {enableLightbox && lightboxIndex !== null && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                closeLightbox()
              }}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              aria-label="Close"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                prevImage()
              }}
              className="absolute left-4 text-white hover:text-gray-300 transition-colors"
              aria-label="Previous"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
              className="absolute right-4 text-white hover:text-gray-300 transition-colors"
              aria-label="Next"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="relative max-w-7xl max-h-[90vh] w-full h-full mx-4" onClick={(e) => e.stopPropagation()}>
              <Image
                src={urlFor(images[lightboxIndex]).width(1920).height(1080).url()}
                alt={images[lightboxIndex].alt}
                fill
                className="object-contain"
              />
              {images[lightboxIndex].caption && (
                <div className="absolute inset-x-0 bottom-0 bg-black/70 text-white p-4 text-center">
                  <p>{images[lightboxIndex].caption}</p>
                </div>
              )}
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
              {lightboxIndex + 1} / {images.length}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
