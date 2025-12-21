import {Metadata} from 'next'
import {client} from '@/lib/sanity/client'
import {homePageQuery, profileQuery, appearanceQuery} from '@/lib/sanity/queries'
import {urlFor} from '@/lib/sanity/image'
import PageBuilder from '@/components/PageBuilder'

export async function generateMetadata(): Promise<Metadata> {
  const [page, profile] = await Promise.all([
    client.fetch(homePageQuery, {}, {next: {revalidate: 3600, tags: ['home']}}),
    client.fetch(profileQuery, {}, {next: {revalidate: 3600, tags: ['profile']}}),
  ])

  const siteUrl = profile?.settings?.websiteName || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const ogImage = page?.seo?.ogImage
    ? urlFor(page.seo.ogImage).width(1200).height(630).url()
    : undefined

  const twitterImage = page?.seo?.twitterImage
    ? urlFor(page.seo.twitterImage).width(1200).height(600).url()
    : ogImage

  return {
    title: page?.seo?.metaTitle || page?.title || profile?.company_name || 'Home',
    description: page?.seo?.metaDescription || `Welcome to ${profile?.company_name || 'our website'}`,
    openGraph: {
      title: page?.seo?.metaTitle || page?.title || profile?.company_name,
      description: page?.seo?.metaDescription || `Welcome to ${profile?.company_name || 'our website'}`,
      url: siteUrl,
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
      description: page?.seo?.metaDescription || `Welcome to ${profile?.company_name || 'our website'}`,
      images: twitterImage ? [twitterImage] : undefined,
    },
    alternates: {
      canonical: siteUrl,
    },
    robots: {
      index: !page?.seo?.noindex,
      follow: !page?.seo?.noindex,
    },
  }
}

export default async function Home() {
  const [page, appearance] = await Promise.all([
    client.fetch(homePageQuery, {}, {next: {revalidate: 3600, tags: ['home']}}),
    client.fetch(appearanceQuery, {}, {next: {revalidate: 3600, tags: ['appearance']}}),
  ])

  if (!page) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-4xl font-bold">Welcome to Multipurpose V5</h1>
        <p className="mt-4 text-lg text-gray-600">
          Get started by creating a Home Page in your Sanity Studio.
        </p>
        <a 
          href="http://localhost:3333" 
          className="mt-8 inline-block rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
        >
          Open Sanity Studio
        </a>
      </div>
    )
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
