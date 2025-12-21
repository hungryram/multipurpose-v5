'use client'

import {useEffect, useState} from 'react'
import {TocItem} from '@/lib/utils/toc'
import {ChevronRight} from 'lucide-react'

interface TableOfContentsProps {
  headings: TocItem[]
}

export default function TableOfContents({headings}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-80px 0px -80% 0px',
      }
    )

    headings.forEach(({id}) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 3) return null

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const top = element.offsetTop - 100
      window.scrollTo({top, behavior: 'smooth'})
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        aria-label="Toggle table of contents"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <span className="text-sm font-medium">Contents</span>
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Table of Contents */}
      <nav
        className={`
          lg:block
          fixed lg:sticky top-24 lg:top-24 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto
          bg-white lg:bg-transparent p-6 lg:p-0 rounded-lg shadow-xl lg:shadow-none
          z-50 transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          left-6 right-6 lg:left-auto lg:right-auto
          w-auto lg:w-full
        `}
        aria-label="Table of contents"
      >
        <div className="lg:sticky lg:top-24">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              On This Page
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
              aria-label="Close table of contents"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <ul className="space-y-2 border-l-2 border-gray-200">
            {headings.map(({id, text}) => (
              <li key={id}>
                <button
                  onClick={() => handleClick(id)}
                  className={`
                    block w-full text-left py-1.5 pl-4 -ml-[2px] border-l-2 transition-all
                    ${
                      activeId === id
                        ? 'border-blue-600 text-blue-600 font-medium'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }
                  `}
                >
                  <span className="text-sm leading-tight">{text}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Progress Indicator */}
          <div className="hidden lg:block mt-6 pt-6 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-2">Reading progress</div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{
                  width: `${
                    headings.length > 0
                      ? ((headings.findIndex((h) => h.id === activeId) + 1) / headings.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
