import Image from 'next/image'
import Link from 'next/link'
import {urlFor} from '@/lib/sanity/image'
import {client} from '@/lib/sanity/client'
import {groq} from 'next-sanity'
import SectionHeader from '@/components/SectionHeader'

interface Service {
  _id: string
  title: string
  slug: {current: string}
  excerpt?: string
  image?: any
}

interface ServicesSectionProps {
  content?: any[]
  layout?: 'grid' | 'carousel'
  services?: Array<{_ref: string}>
  limit?: number
  columns?: number
  showExcerpt?: boolean
  backgroundColor?: {hex: string}
  textAlign?: 'left' | 'center' | 'right'
}

async function getServices(serviceRefs?: Array<{_ref: string}>, limit?: number) {
  if (serviceRefs && serviceRefs.length > 0) {
    const ids = serviceRefs.map(ref => ref._ref)
    const query = groq`*[_type == "service" && _id in $ids] | order(_createdAt desc) ${limit ? `[0...${limit}]` : ''} {
      _id,
      title,
      slug,
      excerpt,
      image
    }`
    return client.fetch(query, {ids})
  }

  const query = groq`*[_type == "service"] | order(_createdAt desc) ${limit ? `[0...${limit}]` : ''} {
    _id,
    title,
    slug,
    excerpt,
    image
  }`
  return client.fetch(query)
}

export default async function ServicesSection({
  content,
  layout = 'grid',
  services: serviceRefs,
  limit,
  columns = 3,
  showExcerpt = true,
  backgroundColor,
  textAlign = 'center',
}: ServicesSectionProps) {
  const services: Service[] = await getServices(serviceRefs, limit)

  if (!services?.length) return null

  const bgColor = backgroundColor?.hex || 'transparent'
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'md:grid-cols-2 lg:grid-cols-3'

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

        <div className={`grid ${gridCols} gap-8`}>
          {services.map((service) => (
            <Link
              key={service._id}
              href={`/services/${service.slug.current}`}
              className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {service.image && (
                <div className="relative w-full aspect-video overflow-hidden">
                  <Image
                    src={urlFor(service.image).width(600).height(400).url()}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                {showExcerpt && service.excerpt && (
                  <p className="text-gray-600 line-clamp-3">{service.excerpt}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
