import {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {client} from '@/lib/sanity/client'
import {urlFor} from '@/lib/sanity/image'
import {servicesIndexQuery, profileQuery} from '@/lib/sanity/queries'
import {groq} from 'next-sanity'
import PortableTextBlock from '@/components/PortableTextBlock'

const servicesQuery = groq`*[_type == "service"] | order(title asc) {
  _id,
  title,
  slug,
  excerpt,
  image
}`

// Revalidate every 300 seconds (5 minutes)
export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const [servicesIndex, profile] = await Promise.all([
    client.fetch(servicesIndexQuery),
    client.fetch(profileQuery),
  ])
  
  return {
    title: servicesIndex?.seo?.metaTitle || servicesIndex?.title || 'Services',
    description: servicesIndex?.seo?.metaDescription || `${profile?.company_name || 'Our'} services and solutions`,
  }
}

export default async function ServicesPage() {
  const [servicesIndex, services] = await Promise.all([
    client.fetch(servicesIndexQuery),
    client.fetch(servicesQuery),
  ])

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="max-w-3xl mx-auto mb-12 text-center">
          {servicesIndex?.description && (
            <div className="text-lg text-gray-600 prose prose-lg mx-auto">
              <PortableTextBlock value={servicesIndex.description} />
            </div>
          )}
        </div>

        {/* Services Grid */}
        {services && services.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service: any) => (
              <Link
                key={service._id}
                href={`/services/${service.slug.current}`}
                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                {service.image && (
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={urlFor(service.image).width(600).height(400).url()}
                      alt={service.image.altText || service.image.asset?.altText || service.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h2>
                  {service.excerpt && (
                    <p className="text-gray-600 line-clamp-3">{service.excerpt}</p>
                  )}
                  <div className="mt-4 text-blue-600 font-medium group-hover:underline">
                    Learn more →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No services available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
