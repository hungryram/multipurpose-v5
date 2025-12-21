import Image from 'next/image'
import Link from 'next/link'
import {urlFor} from '@/lib/sanity/image'
import {client} from '@/lib/sanity/client'
import {groq} from 'next-sanity'
import Button from '../Button'
import SectionHeader from '@/components/SectionHeader'

interface Post {
  _id: string
  title: string
  slug: {current: string}
  excerpt?: string
  image?: any
  publishedAt: string
  author?: {
    name: string
  }
}

interface BlogSectionProps {
  content?: any[]
  layout?: 'grid' | 'list' | 'featured' | 'carousel'
  filterBy?: 'latest' | 'category' | 'manual'
  category?: {_ref: string}
  posts?: Array<{_ref: string}>
  limit?: number
  columns?: number
  showExcerpt?: boolean
  showReadMore?: boolean
  backgroundColor?: {hex: string}
  textAlign?: 'left' | 'center' | 'right'
}

async function getPosts({
  filterBy,
  categoryRef,
  postRefs,
  limit = 6,
}: {
  filterBy?: string
  categoryRef?: string
  postRefs?: Array<{_ref: string}>
  limit?: number
}) {
  if (filterBy === 'manual' && postRefs && postRefs.length > 0) {
    const ids = postRefs.map(ref => ref._ref)
    const query = groq`*[_type == "post" && _id in $ids] | order(_createdAt desc) {
      _id,
      title,
      slug,
      excerpt,
      image,
      publishedAt,
      author->{name}
    }`
    return client.fetch(query, {ids})
  }

  if (filterBy === 'category' && categoryRef) {
    const query = groq`*[_type == "post" && references($categoryId)] | order(publishedAt desc) [0...${limit}] {
      _id,
      title,
      slug,
      excerpt,
      image,
      publishedAt,
      author->{name}
    }`
    return client.fetch(query, {categoryId: categoryRef})
  }

  // Default: latest posts
  const query = groq`*[_type == "post"] | order(publishedAt desc) [0...${limit}] {
    _id,
    title,
    slug,
    excerpt,
    image,
    publishedAt,
    author->{name}
  }`
  return client.fetch(query)
}

export default async function BlogSection({
  content,
  layout = 'grid',
  filterBy = 'latest',
  category,
  posts: postRefs,
  limit = 6,
  columns = 3,
  showExcerpt = true,
  showReadMore = true,
  backgroundColor,
  textAlign = 'center',
}: BlogSectionProps) {
  const posts: Post[] = await getPosts({
    filterBy,
    categoryRef: category?._ref,
    postRefs,
    limit,
  })

  if (!posts?.length) return null

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

        <div className={`grid ${layout === 'list' ? 'grid-cols-1 max-w-4xl mx-auto' : gridCols} gap-8`}>
          {posts.map((post) => (
            <article
              key={post._id}
              className={`group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${layout === 'list' ? 'flex flex-col md:flex-row' : ''}`}
            >
              {post.image && (
                <Link
                  href={`/blog/${post.slug.current}`}
                  className={`relative overflow-hidden ${layout === 'list' ? 'md:w-80 h-64 md:h-auto' : 'w-full aspect-video'}`}
                >
                  <Image
                    src={urlFor(post.image).width(600).height(400).url()}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              )}
              <div className={`p-6 ${layout === 'list' ? 'flex-1' : ''}`}>
                <time className="text-sm text-gray-500 block mb-2">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <Link href={`/blog/${post.slug.current}`}>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                </Link>
                {post.author && (
                  <p className="text-sm text-gray-600 mb-3">
                    By {post.author.name}
                  </p>
                )}
                {showExcerpt && post.excerpt && (
                  <p className="text-gray-700 mb-4 line-clamp-3">{post.excerpt}</p>
                )}
                {showReadMore && (
                  <Link
                    href={`/blog/${post.slug.current}`}
                    className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                  >
                    Read more
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
