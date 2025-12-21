'use client'

import {useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {urlFor} from '@/lib/sanity/image'
import {ChevronDown} from 'lucide-react'

interface HeaderProps {
  appearance: any
  nav: any
}

export default function Header({appearance, nav}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null)

  const getHref = (item: any) => {
    if (item.linkType === 'internal') {
      if (item.internalLink?._type === 'home') return '/'
      if (item.internalLink?._type === 'blogIndex') return '/blog'
      if (item.internalLink?._type === 'page') return `/${item.internalLink?.slug}`
      if (item.internalLink?._type === 'post') return `/blog/${item.internalLink?.slug}`
      if (item.internalLink?._type === 'service') return `/services/${item.internalLink?.slug}`
      return `/${item.internalLink?._type}/${item.internalLink?.slug}`
    }
    return item.linkType === 'path' ? item.internalPath : item.externalUrl
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          {appearance?.branding?.logo && (
            <Image
              src={urlFor(appearance.branding.logo).width(200).url()}
              alt={appearance.branding.logo.altText || appearance.branding.logo.asset?.altText || 'Logo'}
              width={appearance.branding.logoWidth || 150}
              height={50}
              className="h-auto"
            />
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {nav?.items?.map((item: any) => (
            <div key={item.text} className="relative group">
              {item.subMenu && item.subMenu.length > 0 ? (
                <>
                  <button className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary">
                    {item.text}
                    <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                  </button>
                  {/* Dropdown */}
                  <div className="absolute left-0 top-full pt-2 opacity-0 invisible -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 ease-out z-50">
                    <div className="bg-white border rounded-lg shadow-lg py-2 min-w-[200px]">
                      {item.subMenu.map((subItem: any, idx: number) => (
                        <Link
                          key={idx}
                          href={getHref(subItem) || '#'}
                          className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                          {...(subItem.newTab && {target: '_blank', rel: 'noopener noreferrer'})}
                        >
                          {subItem.text}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href={getHref(item) || '#'}
                  className="text-sm font-medium transition-colors hover:text-primary"
                  {...(item.newTab && {target: '_blank', rel: 'noopener noreferrer'})}
                >
                  {item.text}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`md:hidden border-t bg-white transition-all duration-300 ease-out grid ${
          mobileMenuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-3">
            {nav?.items?.map((item: any, index: number) => (
              <div 
                key={item.text}
                className={`transition-all duration-300 ${
                  mobileMenuOpen 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 -translate-y-2'
                }`}
                style={{
                  transitionDelay: mobileMenuOpen ? `${100 + index * 50}ms` : '0ms',
                }}
              >
                {item.subMenu && item.subMenu.length > 0 ? (
                  <>
                    <button
                      onClick={() => setOpenSubmenu(openSubmenu === index ? null : index)}
                      className="w-full flex items-center justify-between text-base font-medium transition-colors hover:text-primary py-2"
                    >
                      {item.text}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          openSubmenu === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div 
                      className={`ml-4 space-y-2 grid transition-all duration-200 ${
                        openSubmenu === index ? 'grid-rows-[1fr] mt-2' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div className="overflow-hidden">
                        {item.subMenu.map((subItem: any, subIdx: number) => (
                          <Link
                            key={subIdx}
                            href={getHref(subItem) || '#'}
                            className="block text-sm py-2 transition-colors hover:text-primary"
                            onClick={() => setMobileMenuOpen(false)}
                            {...(subItem.newTab && {target: '_blank', rel: 'noopener noreferrer'})}
                          >
                            {subItem.text}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={getHref(item) || '#'}
                    className="text-base font-medium transition-colors hover:text-primary py-2 block"
                    onClick={() => setMobileMenuOpen(false)}
                    {...(item.newTab && {target: '_blank', rel: 'noopener noreferrer'})}
                  >
                    {item.text}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
