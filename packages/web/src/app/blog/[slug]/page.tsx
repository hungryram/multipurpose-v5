import {Metadata} from 'next'
import {notFound} from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {client} from '@/lib/sanity/client'
import {urlFor} from '@/lib/sanity/image'
import {profileQuery} from '@/lib/sanity/queries'
import {groq} from 'next-sanity'
import PortableTextBlock from '@/components/PortableTextBlock'
import TableOfContents from '@/components/TableOfContents'
import {extractHeadings} from '@/lib/utils/toc'

interface Props {
  params: Promise<{slug: string}>
}

const postQuery = groq`*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  excerpt,
  image,
  body,
  publishedAt,
  _updatedAt,
  author->{
    name,
    bio,
    image
  },
  categories[]->{
    title,
    slug
  },
  seo
}`

const relatedPostsQuery = groq`*[_type == "post" && slug.current != $slug] | order(publishedAt desc) [0...3] {
  _id,
  title,
  slug,
  excerpt,
  image,
  publishedAt
}`

// Revalidate every 300 seconds (5 minutes)
export const revalidate = 300

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const [post, profile] = await Promise.all([
    client.fetch(postQuery, {slug}),
    client.fetch(profileQuery),
  ])

  if (!post) return {}

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const postUrl = `${siteUrl}/blog/${slug}`
  const imageUrl = post.image ? urlFor(post.image).width(1200).height(630).url() : `${siteUrl}/og-image.jpg`

  return {
    title: post.seo?.metaTitle || post.title || profile?.company_name,
    description: post.seo?.metaDescription || post.excerpt || `Read ${post.title || 'this article'} on ${profile?.company_name || 'our blog'}`,
    keywords: post.seo?.metaKeywords,
    openGraph: {
      title: post.seo?.openGraphTitle || post.title || profile?.company_name,
      description: post.seo?.openGraphDescription || post.excerpt || `Read ${post.title || 'this article'} on ${profile?.company_name || 'our blog'}`,
      url: postUrl,
      siteName: profile?.company_name || 'Blog',
      images: [
        {
          url: post.seo?.openGraphImage ? urlFor(post.seo.openGraphImage).width(1200).height(630).url() : imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt,
      authors: [post.author?.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
    alternates: {
      canonical: postUrl,
    },
    robots: {
      index: !post.seo?.noIndex,
      follow: !post.seo?.noFollow,
    },
  }
}

export default async function BlogPost({params}: Props) {
  const {slug} = await params
  const post = await client.fetch(postQuery, {slug})

  if (!post) {
    notFound()
  }

  const relatedPosts = await client.fetch(relatedPostsQuery, {slug})
  const headings = extractHeadings(post.body)

  return (
    <article className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Article Header */}
        <header className="max-w-4xl mx-auto mb-12">
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((category: any) => (
                <Link
                  key={category._id}
                  href={`/blog/category/${category.slug.current}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

          <div className="flex items-center gap-4 text-gray-600">
            {post.author && (
              <>
                {post.author.image && (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={urlFor(post.author.image).width(96).height(96).url()}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <div className="font-medium text-gray-900">{post.author.name}</div>
                  <time className="text-sm">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {post.image && (
          <div className="relative w-full max-w-5xl mx-auto aspect-video rounded-xl overflow-hidden mb-12">
            <Image
              src={urlFor(post.image).width(1200).height(675).url()}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Article Body with ToC */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={headings.length >= 3 ? "lg:grid lg:grid-cols-[280px_1fr] lg:gap-12 xl:gap-16" : ""}>
            {/* Table of Contents - Handles both desktop sidebar and mobile button */}
            {headings.length >= 3 && <TableOfContents headings={headings} />}

            {/* Main Content */}
            <article className={headings.length >= 3 ? "min-w-0" : "max-w-4xl mx-auto"}>
              <div className="prose prose-lg max-w-none">
                <PortableTextBlock value={post.body} />
              </div>
            </article>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className={`mt-8 pt-8 border-t ${headings.length >= 3 ? 'max-w-3xl mx-auto lg:ml-[calc(280px+3rem)] xl:ml-[calc(280px+4rem)]' : 'max-w-4xl mx-auto'}`}>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-semibold text-gray-700">Tags:</span>
              {post.tags.map((tag: any) => (
                <span
                  key={tag.slug.current}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  #{tag.title}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio */}
        {post.author && post.author.bio && (
          <div className="max-w-3xl mx-auto lg:ml-[calc(280px+3rem)] xl:ml-[calc(280px+4rem)] mt-12 p-6 bg-gray-50 rounded-lg flex gap-6">
            {post.author.image && (
              <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0">
                <Image
                  src={urlFor(post.author.image).width(160).height(160).url()}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <div className="font-semibold text-lg mb-2">{post.author.name}</div>
              <p className="text-gray-600">{post.author.bio}</p>
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="max-w-5xl mx-auto lg:ml-[calc(280px+3rem)] xl:ml-[calc(280px+4rem)] mt-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Related Posts</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost: any) => (
                <Link
                  key={relatedPost._id}
                  href={`/blog/${relatedPost.slug.current}`}
                  className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {relatedPost.image && (
                    <div className="relative w-full aspect-video overflow-hidden">
                      <Image
                        src={urlFor(relatedPost.image).width(400).height(225).url()}
                        alt={relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <time className="text-sm text-gray-500">
                      {new Date(relatedPost.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            image: post.image ? urlFor(post.image).width(1200).height(675).url() : undefined,
            datePublished: post.publishedAt,
            dateModified: post._updatedAt,
            author: {
              '@type': 'Person',
              name: post.author?.name,
            },
          }),
        }}
      />
    </article>
  )
}

export async function generateStaticParams() {
  const posts = await client.fetch(groq`*[_type == "post"]{ "slug": slug.current }`)
  return posts.map((post: {slug: string}) => ({slug: post.slug}))
}
