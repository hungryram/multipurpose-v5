'use client'

import Image from 'next/image'
import Link from 'next/link'
import {PortableTextComponents} from '@portabletext/react'
import {urlFor} from '@/lib/sanity/image'
import {slugify} from '@/lib/utils/toc'
import {usePathname} from 'next/navigation'

export const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({children, value}) => {
      const text = (value as any)?.children?.map((c: any) => c.text).join('') || ''
      const id = slugify(text)
      return (
        <h1 id={id} className="text-4xl font-bold mt-8 mb-4 text-gray-900 scroll-mt-24">
          {children}
        </h1>
      )
    },
    h2: ({children, value}) => {
      const text = (value as any)?.children?.map((c: any) => c.text).join('') || ''
      const id = slugify(text)
      return (
        <h2 id={id} className="text-3xl font-bold mt-8 mb-4 text-gray-900 scroll-mt-24">
          {children}
        </h2>
      )
    },
    h3: ({children}) => (
      <h3 className="text-2xl font-bold mt-6 mb-3 text-gray-900">{children}</h3>
    ),
    h4: ({children}) => (
      <h4 className="text-xl font-bold mt-6 mb-3 text-gray-900">{children}</h4>
    ),
    h5: ({children}) => (
      <h5 className="text-lg font-bold mt-4 mb-2 text-gray-900">{children}</h5>
    ),
    h6: ({children}) => (
      <h6 className="text-base font-bold mt-4 mb-2 text-gray-900">{children}</h6>
    ),
    normal: ({children}) => (
      <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
    ),
    blockquote: ({children}) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-6 italic text-gray-700 bg-gray-50">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({children}) => (
      <ul className="list-disc list-outside ml-6 mb-4 space-y-2 text-gray-700">
        {children}
      </ul>
    ),
    number: ({children}) => (
      <ol className="list-decimal list-outside ml-6 mb-4 space-y-2 text-gray-700">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({children}) => <li className="leading-relaxed">{children}</li>,
    number: ({children}) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({children}) => (
      <strong className="font-bold text-gray-900">{children}</strong>
    ),
    em: ({children}) => <em className="italic">{children}</em>,
    code: ({children}) => (
      <code className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
    link: ({children, value}) => {
      // Handle new dynamic link annotation
      if (value?.linkType === 'internal' && value?.internalLink) {
        const ref = value.internalLink
        let href = '/'
        
        // Resolve internal link based on document type
        if (ref._type === 'home') {
          href = '/'
        } else if (ref._type === 'blogIndex') {
          href = '/blog'
        } else if (ref._type === 'servicesIndex') {
          href = '/services'
        } else if (ref._type === 'post') {
          href = `/blog/${ref.slug || ''}`
        } else if (ref._type === 'service') {
          href = `/services/${ref.slug || ''}`
        } else if (ref._type === 'page') {
          href = `/${ref.slug || ''}`
        }
        
        return (
          <Link
            href={href}
            target={value?.newTab ? '_blank' : undefined}
            rel={value?.newTab ? 'noopener noreferrer' : undefined}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {children}
          </Link>
        )
      }
      
      // Handle external URLs or legacy links
      const href = value?.externalUrl || value?.href || '#'
      const isExternal = href.startsWith('http')
      const openInNewTab = value?.newTab ?? isExternal
      
      return (
        <Link
          href={href}
          target={openInNewTab ? '_blank' : undefined}
          rel={openInNewTab ? 'noopener noreferrer' : undefined}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {children}
        </Link>
      )
    },
  },
  types: {
    breadcrumb: function BreadcrumbComponent({value}: any) {
      const pathname = usePathname()
      const paths = pathname.split('/').filter(Boolean)
      
      const separator = value?.separator || 'chevron'
      const alignment = value?.alignment || 'left'
      const color = value?.color?.hex
      
      const separatorMap: Record<string, string> = {
        slash: '/',
        chevron: '›',
        arrow: '→',
        dot: '•',
        pipe: '|',
      }
      
      const alignmentMap: Record<string, string> = {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
      }
      const alignmentClass = alignmentMap[alignment] || 'justify-start'
      
      const breadcrumbs = [
        {label: 'Home', href: '/'},
        ...paths.map((path, index) => {
          const href = '/' + paths.slice(0, index + 1).join('/')
          const label = path
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
          return {label, href}
        }),
      ]

      return (
        <nav aria-label="Breadcrumb" className="my-6" style={color ? {color} : undefined}>
          <ol className={`flex flex-wrap items-center gap-2 text-sm ${alignmentClass} ${!color ? 'text-gray-600' : ''}`}>
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.href} className="flex items-center gap-2">
                {index < breadcrumbs.length - 1 ? (
                  <>
                    <Link
                      href={crumb.href}
                      className="hover:opacity-70 transition-opacity"
                    >
                      {crumb.label}
                    </Link>
                    <span className="opacity-50">{separatorMap[separator]}</span>
                  </>
                ) : (
                  <span className="font-medium opacity-90">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )
    },
    image: ({value}) => {
      if (!value?.asset) return null
      return (
        <div className="my-8 rounded-lg overflow-hidden">
          <Image
            src={urlFor(value).width(800).height(600).url()}
            alt={value.alt || 'Blog image'}
            width={800}
            height={600}
            className="w-full h-auto"
          />
          {value.caption && (
            <p className="text-sm text-gray-600 text-center mt-2 italic">
              {value.caption}
            </p>
          )}
        </div>
      )
    },
    code: ({value}) => (
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6">
        <code className="text-sm font-mono">{value?.code}</code>
      </pre>
    ),
  },
}
