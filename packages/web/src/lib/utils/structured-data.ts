// Utility function to generate JSON-LD structured data for SEO

export function generateBlogPostingSchema(post: {
  title: string
  excerpt?: string
  publishedAt?: string
  _updatedAt?: string
  author?: {name: string; image?: any}
  image?: any
  slug: {current: string}
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const postUrl = `${siteUrl}/blog/${post.slug.current}`

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: postUrl,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt || post.publishedAt,
    author: post.author
      ? {
          '@type': 'Person',
          name: post.author.name,
        }
      : undefined,
    image: post.image
      ? {
          '@type': 'ImageObject',
          url: post.image.asset?.url,
        }
      : undefined,
  }
}

export function generateWebPageSchema(page: {
  title: string
  seo?: {metaDescription?: string}
  slug?: {current: string}
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const pageUrl = page.slug ? `${siteUrl}/${page.slug.current}` : siteUrl

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.seo?.metaDescription,
    url: pageUrl,
  }
}

export function generateBreadcrumbSchema(items: Array<{name: string; url: string}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateOrganizationSchema(org: {
  name: string
  url: string
  logo?: string
  description?: string
  socialLinks?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    url: org.url,
    logo: org.logo
      ? {
          '@type': 'ImageObject',
          url: org.logo,
        }
      : undefined,
    description: org.description,
    sameAs: org.socialLinks,
  }
}
