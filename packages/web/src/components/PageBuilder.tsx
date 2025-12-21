import dynamic from 'next/dynamic'
import SectionErrorBoundary from './SectionErrorBoundary'
import Image from 'next/image'
import {urlFor} from '@/lib/sanity/image'
import {cn} from '@/lib/utils'
import {getSectionSpacing, getCustomSpacing, getContainerWidth, getBackgroundStyle} from '@/lib/utils/section'

// Dynamic imports for better code splitting and performance
// All sections render on server (SEO-friendly) but JS loads on-demand
const Hero = dynamic(() => import('./sections/Hero'))
const Content = dynamic(() => import('./sections/Content'))
const CtaSection = dynamic(() => import('./sections/CTASection'))
const Testimonials = dynamic(() => import('./sections/Testimonials'))
const TeamSection = dynamic(() => import('./sections/TeamSection'))
const ServicesSection = dynamic(() => import('./sections/ServicesSection'))
const BlogSection = dynamic(() => import('./sections/BlogSection'))
const Gallery = dynamic(() => import('./sections/Gallery'))
const FAQ = dynamic(() => import('./sections/FAQ'))
const ContactForm = dynamic(() => import('./sections/ContactForm'))
const FeaturedGrid = dynamic(() => import('./sections/FeaturedGrid'))
const LogoCloud = dynamic(() => import('./sections/LogoCloud'))
const Accordion = dynamic(() => import('./sections/Accordion'))

interface PageBuilderProps {
  sections: any[]
  appearance?: {
    mainColors?: {
      primaryColor?: {hex?: string}
      secondaryColor?: {hex?: string}
      accentColor?: {hex?: string}
      neutralColor?: {hex?: string}
      websiteTextColor?: {hex?: string}
      websiteHeadingColor?: {hex?: string}
      buttonBackgroundColor?: {hex?: string}
      buttonTextColor?: {hex?: string}
    }
  }
}

export default function PageBuilder({ sections, appearance }: PageBuilderProps) {
  if (!sections || sections.length === 0) return null

  return (
    <>
      {sections.map((section, index) => {
        // Ensure we have required properties
        if (!section?._type) {
          console.warn('Section missing _type:', section)
          return null
        }

        const sectionKey = section._key || `section-${section._type}-${index}`

        const content = (() => {
          switch (section._type) {
            case 'hero':
              return <Hero data={section} />
            case 'content':
              return <Content data={section} />
            case 'ctaSection':
              return <CtaSection data={section} />
            case 'featuredGrid':
              return <FeaturedGrid data={section} />
            case 'logoCloud':
              return <LogoCloud data={section} />
            case 'accordion':
              return <Accordion data={section} />
            case 'testimonials':
              return <Testimonials {...section} />
            case 'teamSection':
              return <TeamSection {...section} />
            case 'servicesSection':
              return <ServicesSection {...section} />
            case 'blogSection':
              return <BlogSection {...section} />
            case 'gallery':
              return <Gallery {...section} />
            case 'faq':
              return <FAQ {...section} />
            case 'contactForm':
              return <ContactForm {...section} />
            default:
              return null
          }
        })()

        if (!content) return null

        const spacingClass = getSectionSpacing(
          section.paddingTop,
          section.paddingBottom,
          section.paddingTopCustom,
          section.paddingBottomCustom
        )
        const customSpacing = getCustomSpacing(
          section.paddingTop,
          section.paddingBottom,
          section.paddingTopCustom,
          section.paddingBottomCustom
        )
        const backgroundStyle = getBackgroundStyle(
          section.backgroundType,
          section.backgroundColorRef,
          section.backgroundCustomColor,
          section.backgroundGradient,
          section.backgroundImage,
          section.textColorRef,
          section.textCustomColor,
          appearance
        )

        // Check if section has background image
        const hasBackgroundImage = section.backgroundType === 'image' && section.backgroundImage?.image

        // Determine if section needs full width (no container wrapper)
        // Hero and fullWidthImage content handle their own containers internally
        const isFullWidth = 
          section._type === 'hero' ||
          (section._type === 'content' && section.layout === 'fullWidthImage') ||
          (section._type === 'ctaSection' && section.layout === 'card')
        
        return (
          <SectionErrorBoundary key={sectionKey} sectionName={section._type}>
            <section
              key={sectionKey}
              {...(section.anchorId && { id: section.anchorId })}
              className={cn(spacingClass || undefined, hasBackgroundImage && 'relative overflow-hidden')}
              style={{...backgroundStyle, ...customSpacing}}
            >
              {/* Background Image Layer */}
              {hasBackgroundImage && (
                <>
                  <Image
                    src={urlFor(section.backgroundImage.image).width(1920).height(1080).url()}
                    alt=""
                    fill
                    className="object-cover -z-10"
                    priority={section.backgroundImage.priority || false}
                    placeholder="blur"
                    blurDataURL={section.backgroundImage.image.asset?.metadata?.lqip}
                  />
                  {section.backgroundImage.overlayColor && (
                    <div
                      className="absolute inset-0 -z-10"
                      style={{
                        backgroundColor: section.backgroundImage.overlayColor.hex,
                        opacity: (section.backgroundImage.overlayOpacity || 50) / 100,
                      }}
                    />
                  )}
                </>
              )}

              {/* Content Layer */}
              {isFullWidth ? (
                content
              ) : (
                <div className={cn(getContainerWidth(section.containerWidth), 'px-4')}>
                  {content}
                </div>
              )}
            </section>
          </SectionErrorBoundary>
        )
      })}
    </>
  )
}
