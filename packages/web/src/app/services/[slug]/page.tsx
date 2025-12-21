import {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {client} from '@/lib/sanity/client'
import {serviceQuery, allServicesQuery, profileQuery, appearanceQuery} from '@/lib/sanity/queries'
import {urlFor} from '@/lib/sanity/image'
import PageBuilder from '@/components/PageBuilder'
import {groq} from 'next-sanity'

interface Props {
  params: Promise<{slug: string}>
}

// Revalidate every 60 seconds (ISR)
export const revalidate = 60

export async function generateStaticParams() {
  const services = await client.fetch(allServicesQuery)
  return services.map((service: any) => ({
    slug: service.slug,
  }))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const [service, profile] = await Promise.all([
    client.fetch(serviceQuery, {slug}),
    client.fetch(profileQuery),
  ])

  if (!service) {
    return {
      title: 'Service Not Found',
    }
  }

  const siteUrl = profile?.settings?.websiteName || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const pageUrl = `${siteUrl}/services/${slug}`
  const ogImage = service?.seo?.ogImage
    ? urlFor(service.seo.ogImage).width(1200).height(630).url()
    : service?.image
    ? urlFor(service.image).width(1200).height(630).url()
    : undefined

  const twitterImage = service?.seo?.twitterImage
    ? urlFor(service.seo.twitterImage).width(1200).height(600).url()
    : ogImage

  return {
    title: service?.seo?.metaTitle || service?.title || profile?.company_name,
    description: service?.seo?.metaDescription || service?.excerpt || `Learn about ${service?.title || 'our services'} at ${profile?.company_name || 'our company'}`,
    openGraph: {
      title: service?.seo?.metaTitle || service?.title || profile?.company_name,
      description: service?.seo?.metaDescription || service?.excerpt || `Learn about ${service?.title || 'our services'} at ${profile?.company_name || 'our company'}`,
      url: pageUrl,
      siteName: profile?.company_name,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: service?.title,
            },
          ]
        : undefined,
      type: 'website',
    },
    twitter: {
      card: service?.seo?.twitterCard || 'summary_large_image',
      title: service?.seo?.metaTitle || service?.title || profile?.company_name,
      description: service?.seo?.metaDescription || service?.excerpt || `Learn about ${service?.title || 'our services'} at ${profile?.company_name || 'our company'}`,
      images: twitterImage ? [twitterImage] : undefined,
    },
    alternates: {
      canonical: pageUrl,
    },
    robots: {
      index: !service?.seo?.noindex,
      follow: !service?.seo?.noindex,
    },
  }
}

export default async function ServicePage({params}: Props) {
  const {slug} = await params
  const [service, appearance] = await Promise.all([
    client.fetch(serviceQuery, {slug}),
    client.fetch(appearanceQuery, {}, {next: {revalidate: 3600, tags: ['appearance']}}),
  ])

  if (!service) {
    notFound()
  }

  return (
    <>
      <PageBuilder sections={service.pageBuilder || []} appearance={appearance} />
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: service.title,
            description: service.seo?.metaDescription || service.excerpt,
          }),
        }}
      />
    </>
  )
}
