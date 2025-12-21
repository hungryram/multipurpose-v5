export function generateStructuredData(data: {
  profile?: any
  page?: {
    title?: string
    seo?: {
      metaDescription?: string
    }
  }
}) {
  const {profile, page} = data

  const structuredData: any = {
    '@context': 'https://schema.org',
    '@graph': [],
  }

  // Organization
  if (profile) {
    structuredData['@graph'].push({
      '@type': 'Organization',
      '@id': `${profile.settings?.websiteName}#organization`,
      name: profile.company_name,
      url: profile.settings?.websiteName,
      logo: profile.branding?.logo?.asset?.url,
      contactPoint: {
        '@type': 'ContactPoint',
        email: profile.contact_information?.email,
        telephone: profile.contact_information?.phone,
      },
      address: profile.address
        ? {
            '@type': 'PostalAddress',
            streetAddress: profile.address.street,
            addressLocality: profile.address.city,
            addressRegion: profile.address.state,
            postalCode: profile.address.zip,
          }
        : undefined,
      sameAs: Object.values(profile.social || {}).filter(Boolean),
    })
  }

  // WebSite
  if (profile?.settings?.websiteName) {
    structuredData['@graph'].push({
      '@type': 'WebSite',
      '@id': `${profile.settings.websiteName}#website`,
      url: profile.settings.websiteName,
      name: profile.company_name,
      publisher: {
        '@id': `${profile.settings.websiteName}#organization`,
      },
    })
  }

  // WebPage
  if (page) {
    structuredData['@graph'].push({
      '@type': 'WebPage',
      '@id': `${profile?.settings?.websiteName}#webpage`,
      url: profile?.settings?.websiteName,
      name: page.title,
      description: page.seo?.metaDescription,
      isPartOf: {
        '@id': `${profile?.settings?.websiteName}#website`,
      },
    })
  }

  return structuredData
}
