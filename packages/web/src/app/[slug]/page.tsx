import {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {client} from '@/lib/sanity/client'
import {pageQuery, allPagesQuery, profileQuery, appearanceQuery} from '@/lib/sanity/queries'
import {urlFor} from '@/lib/sanity/image'
import PageBuilder from '@/components/PageBuilder'
import {groq} from 'next-sanity'

interface Props {
  params: Promise<{slug: string}>
}

// Revalidate every 60 seconds (ISR)
export const revalidate = 60

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const [page, profile] = await Promise.all([
    client.fetch(pageQuery, {slug}),
    client.fetch(profileQuery),
  ])

  if (!page) return {}

  const siteUrl = profile?.settings?.websiteName || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const pageUrl = `${siteUrl}/${slug}`
  const ogImage = page?.seo?.ogImage
    ? urlFor(page.seo.ogImage).width(1200).height(630).url()
    : undefined

  const twitterImage = page?.seo?.twitterImage
    ? urlFor(page.seo.twitterImage).width(1200).height(600).url()
    : ogImage

  return {
    title: page?.seo?.metaTitle || page?.title || profile?.company_name,
    description: page?.seo?.metaDescription || `${page?.title || 'Page'} - ${profile?.company_name}`,
    openGraph: {
      title: page?.seo?.metaTitle || page?.title || profile?.company_name,
      description: page?.seo?.metaDescription || `${page?.title || 'Page'} - ${profile?.company_name}`,
      url: pageUrl,
      siteName: profile?.company_name,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: page?.title,
            },
          ]
        : undefined,
      type: 'website',
    },
    twitter: {
      card: page?.seo?.twitterCard || 'summary_large_image',
      title: page?.seo?.metaTitle || page?.title || profile?.company_name,
      description: page?.seo?.metaDescription || `${page?.title || 'Page'} - ${profile?.company_name}`,
      images: twitterImage ? [twitterImage] : undefined,
    },
    alternates: {
      canonical: pageUrl,
    },
    robots: {
      index: !page?.seo?.noindex,
      follow: !page?.seo?.noindex,
    },
  }
}

export default async function Page({params}: Props) {
  const {slug} = await params
  const [page, appearance] = await Promise.all([
    client.fetch(pageQuery, {slug}),
    client.fetch(appearanceQuery),
  ])

  if (!page) {
    notFound()
  }

  return (
    <>
      <PageBuilder sections={page.pageBuilder || []} appearance={appearance} />
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: page.title,
            description: page.seo?.metaDescription,
          }),
        }}
      />
    </>
  )
}

export async function generateStaticParams() {
  const pages = await client.fetch(groq`*[_type == "page"]{ "slug": slug.current }`)
  return pages.map((page: {slug: string}) => ({slug: page.slug}))
}
