import {Metadata} from 'next'
import {notFound} from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {client} from '@/lib/sanity/client'
import {urlFor} from '@/lib/sanity/image'
import {profileQuery} from '@/lib/sanity/queries'
import {groq} from 'next-sanity'

interface Props {
  params: Promise<{slug: string}>
  searchParams: Promise<{page?: string}>
}

const POSTS_PER_PAGE = 12

const categoryQuery = groq`*[_type == "category" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  description
}`

const postsQuery = groq`*[_type == "post" && references($categoryId)] | order(publishedAt desc) [$start...$end] {
  _id,
  title,
  slug,
  excerpt,
  image,
  publishedAt,
  author->{name}
}`

const countQuery = groq`count(*[_type == "post" && references($categoryId)])`

// Revalidate every 300 seconds (5 minutes)
export const revalidate = 300

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const [category, profile] = await Promise.all([
    client.fetch(categoryQuery, {slug}),
    client.fetch(profileQuery),
  ])

  if (!category) return {}

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return {
    title: `${category.title} | ${profile?.company_name || 'Blog'}`,
    description: category.description || `Browse ${category.title} posts on ${profile?.company_name || 'our blog'}`,
    alternates: {
      canonical: `${siteUrl}/blog/category/${slug}`,
    },
  }
}

export default async function CategoryPage({params, searchParams}: Props) {
  const {slug} = await params
  const {page = '1'} = await searchParams
  const currentPage = parseInt(page)

  const category = await client.fetch(categoryQuery, {slug})

  if (!category) {
    notFound()
  }

  const start = (currentPage - 1) * POSTS_PER_PAGE
  const end = start + POSTS_PER_PAGE

  const [posts, totalPosts] = await Promise.all([
    client.fetch(postsQuery, {categoryId: category._id, start, end}),
    client.fetch(countQuery, {categoryId: category._id}),
  ])

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Category Header */}
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.title}</h1>
          {category.description && (
            <p className="text-lg text-gray-600">{category.description}</p>
          )}
          <div className="mt-6">
            <Link
              href="/blog"
              className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to all posts
            </Link>
          </div>
        </div>

        {/* Posts Grid */}
        {posts && posts.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.map((post: any) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug.current}`}
                  className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {post.image && (
                    <div className="relative w-full aspect-video overflow-hidden">
                      <Image
                        src={urlFor(post.image).width(600).height(400).url()}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <time className="text-sm text-gray-500 block mb-2">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>
                    {post.author && (
                      <p className="text-sm text-gray-600 mb-3">By {post.author.name}</p>
                    )}
                    {post.excerpt && (
                      <p className="text-gray-700 line-clamp-3">{post.excerpt}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={`/blog/category/${slug}?page=${currentPage - 1}`}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Previous
                  </Link>
                )}
                {Array.from({length: totalPages}, (_, i) => i + 1).map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={`/blog/category/${slug}?page=${pageNum}`}
                    className={`px-4 py-2 border rounded-lg ${
                      pageNum === currentPage
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </Link>
                ))}
                {currentPage < totalPages && (
                  <Link
                    href={`/blog/category/${slug}?page=${currentPage + 1}`}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No posts found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const categories = await client.fetch(groq`*[_type == "category"]{ "slug": slug.current }`)
  return categories.map((category: {slug: string}) => ({slug: category.slug}))
}
