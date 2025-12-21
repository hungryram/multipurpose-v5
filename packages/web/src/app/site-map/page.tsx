import {Metadata} from 'next'
import Link from 'next/link'
import {client} from '@/lib/sanity/client'
import {profileQuery} from '@/lib/sanity/queries'
import {groq} from 'next-sanity'

export const revalidate = 3600 // Revalidate every hour

export async function generateMetadata(): Promise<Metadata> {
  const profile = await client.fetch(profileQuery)
  
  return {
    title: 'Sitemap',
    description: `Browse all pages, blog posts, and services on ${profile?.company_name || 'our website'}`,
  }
}

const sitemapDataQuery = groq`{
  "pages": *[_type == "page" && !seo.noindex] | order(title asc) {
    title,
    "slug": slug.current,
    _updatedAt
  },
  "posts": *[_type == "post" && !seo.noindex] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    "category": category->title,
    publishedAt
  },
  "services": *[_type == "service" && !seo.noindex] | order(title asc) {
    title,
    "slug": slug.current,
    _updatedAt
  },
  "categories": *[_type == "category"] | order(title asc) {
    title,
    "slug": slug.current,
    "postCount": count(*[_type == "post" && category._ref == ^._id && !seo.noindex])
  }
}`

export default async function SitemapPage() {
  const [data, profile] = await Promise.all([
    client.fetch(sitemapDataQuery),
    client.fetch(profileQuery),
  ])

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sitemap</h1>
          <p className="text-lg text-gray-600">
            Browse all pages and content on {profile?.company_name || 'our website'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Main Pages */}
          <div>
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-gray-200">
              Main Pages
            </h2>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="text-lg hover:text-blue-600 transition-colors flex items-center group"
                >
                  <span className="mr-2 text-gray-400 group-hover:text-blue-600">→</span>
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="text-lg hover:text-blue-600 transition-colors flex items-center group"
                >
                  <span className="mr-2 text-gray-400 group-hover:text-blue-600">→</span>
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  href="/services" 
                  className="text-lg hover:text-blue-600 transition-colors flex items-center group"
                >
                  <span className="mr-2 text-gray-400 group-hover:text-blue-600">→</span>
                  Services
                </Link>
              </li>
              {data?.pages?.map((page: any) => (
                <li key={page.slug}>
                  <Link 
                    href={`/${page.slug}`} 
                    className="text-lg hover:text-blue-600 transition-colors flex items-center group"
                  >
                    <span className="mr-2 text-gray-400 group-hover:text-blue-600">→</span>
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          {data?.services && data.services.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-gray-200">
                Services
              </h2>
              <ul className="space-y-3">
                {data.services.map((service: any) => (
                  <li key={service.slug}>
                    <Link 
                      href={`/services/${service.slug}`} 
                      className="text-lg hover:text-blue-600 transition-colors flex items-center group"
                    >
                      <span className="mr-2 text-gray-400 group-hover:text-blue-600">→</span>
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Blog Categories */}
          {data?.categories && data.categories.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-gray-200">
                Blog Categories
              </h2>
              <ul className="space-y-3">
                {data.categories.map((category: any) => (
                  category.postCount > 0 && (
                    <li key={category.slug}>
                      <Link 
                        href={`/blog/category/${category.slug}`} 
                        className="text-lg hover:text-blue-600 transition-colors flex items-center group"
                      >
                        <span className="mr-2 text-gray-400 group-hover:text-blue-600">→</span>
                        {category.title}
                        <span className="ml-2 text-sm text-gray-500">({category.postCount})</span>
                      </Link>
                    </li>
                  )
                ))}
              </ul>
            </div>
          )}

          {/* Recent Blog Posts */}
          {data?.posts && data.posts.length > 0 && (
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-gray-200">
                Recent Blog Posts
              </h2>
              <ul className="grid md:grid-cols-2 gap-4">
                {data.posts.slice(0, 20).map((post: any) => (
                  <li key={post.slug}>
                    <Link 
                      href={`/blog/${post.slug}`} 
                      className="hover:text-blue-600 transition-colors flex items-start group"
                    >
                      <span className="mr-2 text-gray-400 group-hover:text-blue-600 flex-shrink-0">→</span>
                      <div>
                        <div className="font-medium">{post.title}</div>
                        {post.category && (
                          <div className="text-sm text-gray-500 mt-1">{post.category}</div>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              {data.posts.length > 20 && (
                <div className="mt-6 text-center">
                  <Link 
                    href="/blog" 
                    className="inline-block text-blue-600 hover:underline font-medium"
                  >
                    View all {data.posts.length} blog posts →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* XML Sitemap Link */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            Looking for the XML sitemap?{' '}
            <Link href="/sitemap.xml" className="text-blue-600 hover:underline font-medium">
              View XML Sitemap
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
