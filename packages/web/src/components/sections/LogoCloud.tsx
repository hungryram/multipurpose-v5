'use client'

import SectionHeader from '@/components/SectionHeader'
import Image from 'next/image'
import {urlFor} from '@/lib/sanity/image'
import {cn} from '@/lib/utils'
import {useState, useEffect} from 'react'

interface LogoCloudProps {
  data: {
    content?: any[]
    layout?: 'grid' | 'carousel'
    textAlign?: 'left' | 'center' | 'right'
    logos?: Array<{
      _key: string
      image: any
      name?: string
      url?: string
    }>
    columns?: number
    grayscale?: boolean
  }
}

export default function LogoCloud({data}: LogoCloudProps) {
  const {
    content,
    layout = 'grid',
    textAlign = 'center',
    logos = [],
    columns = 4,
    grayscale = true,
  } = data

  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-advance carousel
  useEffect(() => {
    if (layout === 'carousel' && logos.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % logos.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [layout, logos.length])

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  }

  const LogoItem = ({logo}: {logo: any}) => {
    const logoImage = (
      <Image
        src={urlFor(logo.image).width(200).height(100).url()}
        alt={logo.name || 'Company logo'}
        width={200}
        height={100}
        className={cn(
          'w-full h-20 object-contain transition-all duration-300',
          grayscale && 'grayscale opacity-60 hover:grayscale-0 hover:opacity-100'
        )}
      />
    )

    if (logo.url) {
      return (
        <a
          href={logo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-4"
        >
          {logoImage}
        </a>
      )
    }

    return <div className="flex items-center justify-center p-4">{logoImage}</div>
  }

  return (
    <div>
      {/* Section Header */}
      {content && (
        <SectionHeader
          content={content}
          align={textAlign}
        />
      )}

      {/* Grid Layout */}
      {layout === 'grid' && (
        <div className={cn('grid gap-8 mt-12', gridCols[columns as keyof typeof gridCols] || gridCols[4])}>
          {logos.map((logo) => (
            <LogoItem key={logo._key} logo={logo} />
          ))}
        </div>
      )}

      {/* Carousel Layout */}
      {layout === 'carousel' && (
        <div className="mt-12 relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{transform: `translateX(-${currentIndex * 100}%)`}}
          >
            {logos.map((logo) => (
              <div key={logo._key} className="w-full flex-shrink-0 px-4">
                <LogoItem logo={logo} />
              </div>
            ))}
          </div>
          
          {/* Carousel dots */}
          <div className="flex justify-center gap-2 mt-8">
            {logos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  index === currentIndex ? 'bg-gray-800 w-6' : 'bg-gray-300'
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
