import groq from 'groq'

// Reusable fragments
export const seoFields = groq`
  seo {
    metaTitle,
    metaDescription,
    ogImage {
      asset-> {
        url,
        metadata {
          lqip,
          dimensions
        }
      }
    },
    twitterCard,
    twitterImage {
      asset-> {
        url,
        metadata {
          lqip,
          dimensions
        }
      }
    },
    noindex
  }
`

export const buttonFields = groq`
  text,
  linkType,
  internalLink-> {
    _type,
    title,
    "slug": slug.current
  },
  internalPath,
  externalUrl,
  newTab,
  bgColorRef,
  bgCustomColor,
  textColorRef,
  textCustomColor,
  borderColorRef,
  borderCustomColor,
  hoverBgColorRef,
  hoverBgCustomColor,
  hoverTextColorRef,
  hoverTextCustomColor
`

export const imageFields = groq`
  asset-> {
    url,
    altText,
    metadata {
      lqip,
      dimensions
    }
  },
  altText
`

export const portableTextFields = groq`
  ...,
  markDefs[]{
    ...,
    _type == "link" => {
      _type,
      _key,
      linkType,
      "internalLink": internalLink-> {
        _type,
        "slug": slug.current,
        title
      },
      externalUrl,
      newTab
    }
  }
`

export const sectionSettingsFields = groq`
  paddingTop,
  paddingTopCustom,
  paddingBottom,
  paddingBottomCustom,
  containerWidth,
  anchorId,
  backgroundType,
  backgroundColorRef,
  backgroundCustomColor { hex },
  backgroundGradient {
    fromRef,
    fromCustom { hex },
    toRef,
    toCustom { hex },
    direction
  },
  backgroundImage {
    image { ${imageFields} },
    priority,
    overlayColorRef,
    overlayCustomColor { hex },
    overlayOpacity
  },
  textColorRef,
  textCustomColor { hex },
  textAlign,
  primaryButton { ${buttonFields} },
  secondaryButton { ${buttonFields} }
`

export const pageBuilderFields = groq`
  _type,
  _key,
  
  // Hero fields
  _type == "hero" => {
    content[]{ ${portableTextFields} },
    image { ${imageFields} },
    primaryButton { ${buttonFields} },
    secondaryButton { ${buttonFields} },
    height,
    textAlign,
    overlayColor,
    ${sectionSettingsFields}
  },
  
  // Content fields
  _type == "content" => {
    content[]{ ${portableTextFields} },
    image { ${imageFields} },
    layout,
    textAlign,
    primaryButton { ${buttonFields} },
    ${sectionSettingsFields}
  },
  
  // CTA fields
  _type == "ctaSection" => {
    content[]{ ${portableTextFields} },
    layout,
    textAlign,
    reverseColumn,
    spacing,
    image { ${imageFields} },
    primaryButton { ${buttonFields} },
    secondaryButton { ${buttonFields} },
    ${sectionSettingsFields}
  },
  
  // Featured Grid fields
  _type == "featuredGrid" => {
    content[]{ ${portableTextFields} },
    layout,
    textAlign,
    primaryButton { ${buttonFields} },
    secondaryButton { ${buttonFields} },
    blocks[] {
      _key,
      image { ${imageFields} },
      heading,
      content[]{ ${portableTextFields} },
      button { ${buttonFields} }
    },
    columns,
    ${sectionSettingsFields}
  },
  
  // Logo Cloud fields
  _type == "logoCloud" => {
    content[]{ ${portableTextFields} },
    layout,
    textAlign,
    logos[] {
      _key,
      image { ${imageFields} },
      name,
      url
    },
    columns,
    grayscale,
    ${sectionSettingsFields}
  },
  
  // Accordion fields
  _type == "accordion" => {
    content[]{ ${portableTextFields} },
    textAlign,
    items[] {
      _key,
      title,
      content[]{ ${portableTextFields} }
    },
    allowMultiple,
    firstOpen,
    ${sectionSettingsFields}
  },
  
  // Testimonials fields
  _type == "testimonials" => {
    content[]{ ${portableTextFields} },
    layout,
    textAlign,
    testimonials[] {
      quote,
      author,
      role,
      company,
      image { ${imageFields} },
      rating
    },
    columns,
    showRatings,
    ${sectionSettingsFields}
  },
  
  // Contact Form fields
  _type == "contactForm" => {
    content[]{ ${portableTextFields} },
    textAlign,
    formFields[] {
      _key,
      fieldType,
      label,
      placeholder,
      required,
      options,
      halfWidth
    },
    submitButtonText,
    successMessage,
    notificationEmail,
    googleSheetId,
    googleSheetTabName,
    redirectAfterSubmit,
    redirectPage {
      linkType,
      internalLink-> {
        _type,
        "slug": slug.current
      },
      internalPath,
      externalUrl
    },
    layout,
    sideContent[]{ ${portableTextFields} },
    ${sectionSettingsFields}
  },
  
  // Blog Section fields
  _type == "blogSection" => {
    content[]{ ${portableTextFields} },
    layout,
    filterBy,
    category-> {
      _id,
      title,
      "slug": slug.current
    },
    posts[]-> {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      excerpt,
      mainImage { ${imageFields} },
      author-> {
        name,
        image { ${imageFields} }
      }
    },
    limit,
    columns,
    showExcerpt,
    showReadMore,
    ${sectionSettingsFields}
  }
`

// Profile and appearance
export const profileQuery = groq`
  *[_type == "profile"][0] {
    company_name,
    contact_information,
    address,
    social,
    settings
  }
`

export const brandBriefQuery = groq`
  *[_type == "brandBrief"][0] {
    industry,
    businessModel,
    productServices,
    uniqueSellingProposition,
    companySize,
    targetAudience,
    audiencePainPoints,
    audienceGoals,
    buyingBehavior,
    competitors[] {
      name,
      website,
      strengths,
      weaknesses
    },
    seedKeywords,
    topicClusters,
    contentGoals,
    contentFrequency,
    toneOfVoice,
    writingStyle,
    avoidWords,
    preferredWords
  }
`

export const appearanceQuery = groq`
  *[_type == "appearance"][0] {
    branding {
      favicon { ${imageFields} },
      logo { ${imageFields} },
      logoScroll { ${imageFields} },
      logoWidth
    },
    mainColors,
    header {
      navColor,
      headerColor,
      navScrollColor,
      headerColorScroll,
      mainNav-> {
        title,
        items[] {
          text,
          ${buttonFields},
          subMenu[] {
            text,
            ${buttonFields}
          }
        }
      }
    },
    footer {
      footerText[]{ ${portableTextFields} },
      footerBackgroundColor,
      textColor
    }
  }
`

// Blog Index
export const blogIndexQuery = groq`
  *[_type == "blogIndex"][0] {
    title,
    description[]{ ${portableTextFields} },
    ${seoFields}
  }
`

// Services Index
export const servicesIndexQuery = groq`
  *[_type == "servicesIndex"][0] {
    title,
    description[]{ ${portableTextFields} },
    ${seoFields}
  }
`

// Home page
export const homePageQuery = groq`
  *[_type == "appearance"][0].homePage-> {
    title,
    ${seoFields},
    pageBuilder[] {
      ${pageBuilderFields}
    }
  }
`

// Pages
export const pageQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    title,
    ${seoFields},
    pageBuilder[] {
      ${pageBuilderFields}
    }
  }
`

export const allPagesQuery = groq`
  *[_type == "page"] {
    "slug": slug.current,
    title,
    _updatedAt
  }
`

// Services
export const serviceQuery = groq`
  *[_type == "service" && slug.current == $slug][0] {
    title,
    excerpt,
    image,
    ${seoFields},
    pageBuilder[] {
      ${pageBuilderFields}
    }
  }
`

export const allServicesQuery = groq`
  *[_type == "service"] | order(_createdAt desc) {
    title,
    "slug": slug.current,
    excerpt,
    image { ${imageFields} }
  }
`

// Blog
export const allPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    mainImage { ${imageFields} },
    author-> {
      name,
      "slug": slug.current
    },
    categories[]-> {
      title,
      "slug": slug.current
    },
    tags[]-> {
      title,
      "slug": slug.current
    }
  }
`

export const postQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    title,
    excerpt,
    publishedAt,
    _updatedAt,
    mainImage { ${imageFields} },
    body[]{ ${portableTextFields} },
    author-> {
      name,
      "slug": slug.current,
      image { ${imageFields} },
      bio[]{ ${portableTextFields} }
    },
    categories[]-> {
      title,
      "slug": slug.current
    },
    tags[]-> {
      title,
      "slug": slug.current
    },
    ${seoFields}
  }
`

// Team
export const allTeamQuery = groq`
  *[_type == "team"] | order(_createdAt asc) {
    name,
    position,
    image { ${imageFields} },
    social
  }
`

// Sitemap
export const sitemapQuery = groq`
  {
    "pages": *[_type == "page"] {
      "slug": slug.current,
      _updatedAt,
      seo
    },
    "posts": *[_type == "post"] {
      "slug": slug.current,
      _updatedAt,
      seo
    },
    "services": *[_type == "service"] {
      "slug": slug.current,
      _updatedAt,
      seo
    },
    "categories": *[_type == "category"] {
      "slug": slug.current,
      _updatedAt
    }
  }
`

