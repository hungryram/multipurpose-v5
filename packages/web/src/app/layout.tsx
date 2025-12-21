import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {Analytics} from '@/components/Analytics'
import {WebVitals} from '@/components/WebVitals'
import {client} from '@/lib/sanity/client'
import {profileQuery, appearanceQuery} from '@/lib/sanity/queries'
import {generateStructuredData} from '@/lib/structured-data'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export async function generateMetadata(): Promise<Metadata> {
  const [profile, appearance] = await Promise.all([
    client.fetch(profileQuery),
    client.fetch(appearanceQuery),
  ])

  const faviconUrl = appearance?.branding?.favicon?.asset?.url

  return {
    title: {
      default: profile?.company_name || '',
      template: `%s | ${profile?.company_name || 'Website'}`,
    },
    authors: [{name: profile?.company_name}],
    icons: faviconUrl
      ? {
          icon: faviconUrl,
          shortcut: faviconUrl,
          apple: faviconUrl,
        }
      : undefined,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: profile?.settings?.websiteName,
      siteName: profile?.company_name,
    },
    verification: profile?.settings?.googleSearchConsole
      ? {
          google: profile.settings.googleSearchConsole,
        }
      : undefined,
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [profile, appearance] = await Promise.all([
    client.fetch(profileQuery),
    client.fetch(appearanceQuery),
  ])
  const structuredData = generateStructuredData({profile})
  const nav = appearance?.header?.mainNav

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData)}}
        />
        <style dangerouslySetInnerHTML={{__html: `
          :root {
            --body-bg: ${appearance?.mainColors?.websiteBgColor?.hex || '#ffffff'};
            --text-color: ${appearance?.mainColors?.websiteTextColor?.hex || '#171717'};
            --heading-color: ${appearance?.mainColors?.websiteHeadingColor?.hex || '#000000'};
            --primary-btn-bg: ${appearance?.mainColors?.buttonBackgroundColor?.hex || '#000000'};
            --primary-btn-text: ${appearance?.mainColors?.buttonTextColor?.hex || '#ffffff'};
            --header-bg: ${appearance?.header?.headerColor?.hex || 'transparent'};
            --header-text: ${appearance?.header?.navColor?.hex || '#000000'};
            --header-bg-scroll: ${appearance?.header?.headerColorScroll?.hex || '#ffffff'};
            --header-text-scroll: ${appearance?.header?.navScrollColor?.hex || '#000000'};
            --footer-bg: ${appearance?.footer?.footerBackgroundColor?.hex || '#000000'};
            --footer-text: ${appearance?.footer?.textColor?.hex || '#ffffff'};
          }
        `}} />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* <WebVitals /> */}
        <Analytics 
          googleID={profile?.settings?.googleID} 
          facebookPixel={profile?.settings?.facebookPixel} 
        />
        <Header appearance={appearance} nav={nav} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
