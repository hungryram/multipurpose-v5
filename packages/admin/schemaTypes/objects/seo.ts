import {defineType} from 'sanity'
import {SeoTitleInput} from '../../components/SeoTitleInput'
import {SeoDescriptionInput} from '../../components/SeoDescriptionInput'
import {SEOMetaGenerator} from '../../components/SEOMetaGenerator'

export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: false,
  },
  components: {
    input: SEOMetaGenerator,
  },
  fields: [
    {
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Custom title for search engines (50-60 characters recommended)',
      components: {
        input: SeoTitleInput,
      },
      validation: (Rule) => Rule.max(60).warning('Should be under 60 characters'),
    },
    {
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      description: 'Brief summary for search engines (70-155 characters recommended)',
      components: {
        input: SeoDescriptionInput,
      },
      validation: (Rule) => Rule.max(160).warning('Should be under 160 characters'),
    },
    {
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Recommended size: 1200x630px (for Facebook, LinkedIn)',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'twitterCard',
      title: 'Twitter Card Type',
      type: 'string',
      options: {
        list: [
          {title: 'Summary', value: 'summary'},
          {title: 'Summary Large Image', value: 'summary_large_image'},
        ],
      },
      initialValue: 'summary_large_image',
    },
    {
      name: 'twitterImage',
      title: 'Twitter Card Image',
      type: 'image',
      description: 'Optional: Use different image for Twitter (1200x600px)',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'noindex',
      title: 'No Index',
      type: 'boolean',
      description: 'Prevent search engines from indexing this page',
      initialValue: false,
    },
  ],
})
