import {defineType} from 'sanity'

export default defineType({
  name: 'redirect',
  type: 'document',
  title: 'Redirects',
  icon: () => '↗️',
  fields: [
    {
      name: 'source',
      type: 'string',
      title: 'Source Path',
      description: 'The old URL path (e.g., /old-page or /blog/old-post)',
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value) return true
          if (!value.startsWith('/')) {
            return 'Path must start with /'
          }
          return true
        }),
    },
    {
      name: 'destination',
      type: 'string',
      title: 'Destination Path',
      description: 'The new URL path (e.g., /new-page) or full URL',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'permanent',
      type: 'boolean',
      title: 'Permanent Redirect (301)',
      description: 'Use 301 for permanent redirects, 302 for temporary',
      initialValue: true,
    },
    {
      name: 'enabled',
      type: 'boolean',
      title: 'Enabled',
      description: 'Toggle to enable/disable this redirect',
      initialValue: true,
    },
  ],
  preview: {
    select: {
      source: 'source',
      destination: 'destination',
      permanent: 'permanent',
      enabled: 'enabled',
    },
    prepare({source, destination, permanent, enabled}) {
      return {
        title: source,
        subtitle: `→ ${destination} ${permanent ? '(301)' : '(302)'}`,
        media: () => (enabled ? '✅' : '❌'),
      }
    },
  },
})
