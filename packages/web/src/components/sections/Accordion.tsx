'use client'

import SectionHeader from '@/components/SectionHeader'
import PortableTextBlock from '@/components/PortableTextBlock'
import {cn} from '@/lib/utils'
import {useState} from 'react'
import {ChevronDown} from 'lucide-react'

interface AccordionProps {
  data: {
    content?: any[]
    textAlign?: 'left' | 'center' | 'right'
    items?: Array<{
      _key: string
      title: string
      content: any[]
    }>
    allowMultiple?: boolean
    firstOpen?: boolean
  }
}

export default function Accordion({data}: AccordionProps) {
  const {
    content,
    textAlign = 'left',
    items = [],
    allowMultiple = false,
    firstOpen = true,
  } = data

  const [openItems, setOpenItems] = useState<Set<string>>(
    firstOpen && items.length > 0 ? new Set([items[0]._key]) : new Set()
  )

  const toggleItem = (key: string) => {
    if (allowMultiple) {
      setOpenItems((prev) => {
        const newSet = new Set(prev)
        if (newSet.has(key)) {
          newSet.delete(key)
        } else {
          newSet.add(key)
        }
        return newSet
      })
    } else {
      setOpenItems((prev) => (prev.has(key) ? new Set() : new Set([key])))
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Section Header */}
      {content && (
        <SectionHeader
          content={content}
          align={textAlign}
          contentClassName="prose prose-lg [&>*:first-child]:text-3xl [&>*:first-child]:font-bold [&>*:first-child]:tracking-tight md:[&>*:first-child]:text-4xl mb-8"
        />
      )}

      {/* Accordion Items */}
      <div className="space-y-4">
        {items.map((item) => {
          const isOpen = openItems.has(item._key)

          return (
            <div key={item._key} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleItem(item._key)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-lg">{item.title}</span>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 transition-transform duration-200',
                    isOpen && 'transform rotate-180'
                  )}
                />
              </button>
              
              <div
                className={cn(
                  'overflow-hidden transition-all duration-200 ease-in-out',
                  isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                )}
              >
                <div className="p-4 pt-0 prose prose-lg max-w-none">
                  <PortableTextBlock value={item.content} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
