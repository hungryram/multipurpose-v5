'use client'

import {useState} from 'react'
import {PortableText} from '@portabletext/react'
import SectionHeader from '@/components/SectionHeader'

interface FAQItem {
  _key: string
  question: string
  answer: any[]
}

interface FAQProps {
  content?: any[]
  items?: FAQItem[]
  layout?: 'single' | 'two-column'
  defaultOpen?: 'closed' | 'first' | 'all'
  allowMultiple?: boolean
  backgroundColor?: {hex: string}
  textAlign?: 'left' | 'center' | 'right'
}

export default function FAQ({
  content,
  items = [],
  layout = 'single',
  defaultOpen = 'closed',
  allowMultiple = false,
  backgroundColor,
  textAlign = 'center',
}: FAQProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(() => {
    if (defaultOpen === 'all') {
      return new Set(items.map(item => item._key))
    }
    if (defaultOpen === 'first' && items.length > 0) {
      return new Set([items[0]._key])
    }
    return new Set()
  })

  if (!items?.length) return null

  const toggleItem = (key: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(key)) {
        newSet.delete(key)
      } else {
        if (!allowMultiple) {
          newSet.clear()
        }
        newSet.add(key)
      }
      return newSet
    })
  }

  const bgColor = backgroundColor?.hex || 'transparent'

  return (
    <section
      className="py-16 md:py-24"
      style={{backgroundColor: bgColor}}
    >
      <div className="container mx-auto px-4">
        <SectionHeader
          content={content}
          contentClassName="prose prose-lg max-w-3xl mx-auto mb-12 [&>*:first-child]:text-3xl [&>*:first-child]:font-bold md:[&>*:first-child]:text-4xl"
          align={textAlign}
        />

        <div className={`max-w-5xl mx-auto ${layout === 'two-column' ? 'md:columns-2 md:gap-8' : ''}`}>
          {items.map((item) => {
            const isOpen = openItems.has(item._key)

            return (
              <div
                key={item._key}
                className={`bg-white rounded-lg shadow-md overflow-hidden mb-4 ${layout === 'two-column' ? 'break-inside-avoid' : ''}`}
              >
                <button
                  onClick={() => toggleItem(item._key)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-lg pr-4">{item.question}</span>
                  <svg
                    className={`w-5 h-5 shrink-0 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-250 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-4 text-gray-700 prose prose-sm max-w-none">
                    <PortableText value={item.answer} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
