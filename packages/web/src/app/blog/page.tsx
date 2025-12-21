import {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {client} from '@/lib/sanity/client'
import {urlFor} from '@/lib/sanity/image'
import {blogIndexQuery, profileQuery} from '@/lib/sanity/queries'
import {groq} from 'next-sanity'
import PortableTextBlock from '@/components/PortableTextBlock'

interface Props {
  searchParams: Promise<{page?: string; category?: string}>
}

const POSTS_PER_PAGE = 12

const postsQuery = groq`*[_type == "post"] | order(publishedAt desc) [$start...$end] {
  _id,
  title,
  slug,
  excerpt,
  image,
  publishedAt,
  author->{name},
  categories[]->{title, slug}
}`

const countQuery = groq`count(*[_type == "post"])`
const categoriesQuery = groq`*[_type == "category"] | order(title asc) {_id, title, slug}`

// Revalidate every 300 seconds (5 minutes)
export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const [blogIndex, profile] = await Promise.all([
    client.fetch(blogIndexQuery),
    client.fetch(profileQuery),
  ])
  
  return {
    title: blogIndex?.seo?.metaTitle || blogIndex?.title || 'Blog',
    description: blogIndex?.seo?.metaDescription || blogIndex?.description || `${profile?.company_name || 'Our'} Blog`,
  }
}

export default async function BlogPage({searchParams}: Props) {
  const {page = '1'} = await searchParams
  const currentPage = parseInt(page)

  const start = (currentPage - 1) * POSTS_PER_PAGE
  const end = start + POSTS_PER_PAGE

  const [blogIndex, posts, totalPosts, categories] = await Promise.all([
    client.fetch(blogIndexQuery),
    client.fetch(postsQuery, {start, end}),
    client.fetch(countQuery),
    client.fetch(categoriesQuery),
  ])

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="max-w-3xl mx-auto mb-12 text-center">
          {blogIndex?.description && (
            <div className="text-lg text-gray-600 prose prose-lg mx-auto">
              <PortableTextBlock value={blogIndex.description} />
            </div>
          )}
        </div>

        {/* Categories Filter */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Link
              href="/blog"
              className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              All Posts
            </Link>
            {categories.map((category: any) => (
              <Link
                key={category._id}
                href={`/blog/category/${category.slug.current}`}
                className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                {category.title}
              </Link>
            ))}
          </div>
        )}

        {/* Posts Grid */}
        {posts && posts.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.map((post: any) => (
                <article
                  key={post._id}
                  className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {post.image && (
                    <Link
                      href={`/blog/${post.slug.current}`}
                      className="relative w-full aspect-video overflow-hidden block"
                    >
                      <Image
                        src={urlFor(post.image).width(600).height(400).url()}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                  )}
                  <div className="p-6">
                    {post.categories && post.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.categories.slice(0, 2).map((category: any) => (
                          <Link
                            key={category._id}
                            href={`/blog/category/${category.slug.current}`}
                            className="text-xs font-medium text-blue-600 hover:text-blue-800"
                          >
                            {category.title}
                          </Link>
                        ))}
                      </div>
                    )}
                    <time className="text-sm text-gray-500 block mb-2">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    <Link href={`/blog/${post.slug.current}`}>
                      <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h2>
                    </Link>
                    {post.author && (
                      <p className="text-sm text-gray-600 mb-3">By {post.author.name}</p>
                    )}
                    {post.excerpt && (
                      <p className="text-gray-700 mb-4 line-clamp-3">{post.excerpt}</p>
                    )}
                    <Link
                      href={`/blog/${post.slug.current}`}
                      className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                    >
                      Read more
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={`/blog?page=${currentPage - 1}`}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Previous
                  </Link>
                )}
                {Array.from({length: totalPages}, (_, i) => i + 1).map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={`/blog?page=${pageNum}`}
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
                    href={`/blog?page=${currentPage + 1}`}
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
            <p className="text-gray-600 text-lg">No posts found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
