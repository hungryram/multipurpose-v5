'use client'

import {useState, useEffect} from 'react'
import Image from 'next/image'
import {urlFor} from '@/lib/sanity/image'
import SectionHeader from '@/components/SectionHeader'
import {cn} from '@/lib/utils'

interface Testimonial {
  quote: string
  author: string
  role?: string
  company?: string
  image?: any
  rating?: number
}

interface TestimonialsProps {
  content?: any[]
  layout?: 'grid' | 'carousel' | 'column'
  testimonials?: Testimonial[]
  columns?: number
  showRatings?: boolean
  backgroundColor?: {hex: string}
  textAlign?: 'left' | 'center' | 'right'
}

export default function Testimonials({
  content,
  layout = 'grid',
  testimonials = [],
  columns = 3,
  showRatings = true,
  backgroundColor,
  textAlign = 'center',
}: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  if (!testimonials?.length) return null

  const bgColor = backgroundColor?.hex || 'transparent'
  const gridCols = {
    1: 'grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
  }[columns] || 'md:grid-cols-2 lg:grid-cols-3'

  // Calculate items per slide for carousel
  const itemsPerSlide = layout === 'carousel' ? columns : 1
  const totalSlides = Math.ceil(testimonials.length / itemsPerSlide)

  // Auto-advance carousel
  useEffect(() => {
    if (layout === 'carousel' && totalSlides > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides)
      }, 5000) // Change slide every 5 seconds
      return () => clearInterval(interval)
    }
  }, [layout, totalSlides])

  const textAlignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[textAlign] || 'text-center'

  const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      {showRatings && testimonial.rating && (
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${
                i < testimonial.rating! ? 'text-yellow-400' : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      )}

      <blockquote className="text-gray-700 mb-6 italic">
        "{testimonial.quote}"
      </blockquote>

      <div className="flex items-center gap-4">
        {testimonial.image && (
          <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
            <Image
              src={urlFor(testimonial.image).width(96).height(96).url()}
              alt={testimonial.author}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div>
          <div className="font-semibold text-gray-900">
            {testimonial.author}
          </div>
          {(testimonial.role || testimonial.company) && (
            <div className="text-sm text-gray-600">
              {testimonial.role}
              {testimonial.role && testimonial.company && ', '}
              {testimonial.company}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div style={{backgroundColor: bgColor}}>
      <SectionHeader
        content={content}
        contentClassName="prose prose-lg max-w-3xl mx-auto mb-12 [&>*:first-child]:text-3xl [&>*:first-child]:font-bold md:[&>*:first-child]:text-4xl"
        align={textAlign}
      />

      {/* Grid and Column Layouts */}
      {(layout === 'grid' || layout === 'column') && (
        <div className={cn('grid gap-8', layout === 'column' ? 'grid-cols-1 max-w-3xl mx-auto' : gridCols)}>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      )}

      {/* Carousel Layout */}
      {layout === 'carousel' && (
        <div>
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{transform: `translateX(-${currentIndex * 100}%)`}}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0 px-4">
                  <div className={cn('grid gap-8', gridCols)}>
                    {testimonials
                      .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                      .map((testimonial, index) => (
                        <TestimonialCard key={slideIndex * itemsPerSlide + index} testimonial={testimonial} />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Navigation */}
          {totalSlides > 1 && (
            <>
              {/* Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalSlides }).map((_, index) => (
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

              {/* Arrow buttons */}
              <button
                onClick={() => setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                aria-label="Previous slide"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % totalSlides)}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                aria-label="Next slide"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
