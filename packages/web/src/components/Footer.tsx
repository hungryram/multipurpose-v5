import {client} from '@/lib/sanity/client'
import {appearanceQuery, profileQuery} from '@/lib/sanity/queries'
import CurrentYear from './CurrentYear'
import PortableTextBlock from './PortableTextBlock'

export default async function Footer() {
  const [appearance, profile] = await Promise.all([
    client.fetch(appearanceQuery),
    client.fetch(profileQuery),
  ])

  return (
    <footer 
      className="border-t"
      style={{
        backgroundColor: appearance?.footer?.footerBackgroundColor?.hex || undefined,
        color: appearance?.footer?.textColor?.hex || undefined,
      }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold">{profile?.company_name}</h3>
            {appearance?.footer?.footerText && (
              <div className="text-sm opacity-80 prose prose-sm prose-invert">
                <PortableTextBlock value={appearance.footer.footerText} />
              </div>
            )}
          </div>

          {profile?.contact_information && (
            <div>
              <h3 className="mb-4 text-lg font-semibold">Contact</h3>
              <div className="space-y-2 text-sm opacity-80">
                {profile.contact_information.email && (
                  <p>Email: {profile.contact_information.email}</p>
                )}
                {profile.contact_information.phone && (
                  <p>Phone: {profile.contact_information.phone}</p>
                )}
              </div>
            </div>
          )}

          {profile?.social && (
            <div>
              <h3 className="mb-4 text-lg font-semibold">Follow Us</h3>
              <div className="flex space-x-4">
                {profile.social.facebook && (
                  <a href={profile.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:opacity-70">
                    Facebook
                  </a>
                )}
                {profile.social.twitter && (
                  <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer" className="hover:opacity-70">
                    Twitter
                  </a>
                )}
                {profile.social.instagram && (
                  <a href={profile.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:opacity-70">
                    Instagram
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm opacity-70">
          <p>© <CurrentYear /> {profile?.company_name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
