import type {MetadataRoute} from 'next/types'
import {client} from '@/lib/sanity/client'
import {sitemapQuery, profileQuery} from '@/lib/sanity/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [data, profile] = await Promise.all([
    client.fetch(sitemapQuery),
    client.fetch(profileQuery),
  ])

  const baseUrl = profile?.settings?.websiteName || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const cleanBase = baseUrl.replace(/\/$/, '')

  const routes: MetadataRoute.Sitemap = [
    {
      url: cleanBase,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]

  // Add pages
  if (data?.pages) {
    data.pages.forEach((page: any) => {
      if (!page.seo?.noindex && page.slug) {
        routes.push({
          url: `${cleanBase}/${page.slug}`,
          lastModified: new Date(page._updatedAt),
          changeFrequency: 'monthly',
          priority: 0.8,
        })
      }
    })
  }

  // Add blog posts
  if (data?.posts) {
    routes.push({
      url: `${cleanBase}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })

    data.posts.forEach((post: any) => {
      if (!post.seo?.noindex && post.slug) {
        routes.push({
          url: `${cleanBase}/blog/${post.slug}`,
          lastModified: new Date(post._updatedAt),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      }
    })
  }

  // Add services
  if (data?.services) {
    routes.push({
      url: `${cleanBase}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    })

    data.services.forEach((service: any) => {
      if (!service.seo?.noindex && service.slug) {
        routes.push({
          url: `${cleanBase}/services/${service.slug}`,
          lastModified: new Date(service._updatedAt),
          changeFrequency: 'monthly',
          priority: 0.7,
        })
      }
    })
  }

  // Add blog categories
  if (data?.categories) {
    data.categories.forEach((category: any) => {
      if (category.slug) {
        routes.push({
          url: `${cleanBase}/blog/category/${category.slug}`,
          lastModified: new Date(category._updatedAt),
          changeFrequency: 'weekly',
          priority: 0.6,
        })
      }
    })
  }

  return routes
}
