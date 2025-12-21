import {defineType} from 'sanity'
import {InternalLinkSuggestions} from '../../components/InternalLinkSuggestions'

export default defineType({
  name: 'service',
  title: 'Services',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Service Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'excerpt',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: 'Used in service listings and meta descriptions',
    },
    {
      name: 'image',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Used in service listings',
    },
    {
      name: 'pageBuilder',
      title: 'Page Builder',
      type: 'array',
      of: [
        {type: 'hero'},
        {type: 'content'},
        {type: 'ctaSection'},
        {type: 'featuredGrid'},
        {type: 'logoCloud'},
        {type: 'accordion'},
        {type: 'testimonials'},
        {type: 'teamSection'},
        {type: 'servicesSection'},
        {type: 'blogSection'},
        {type: 'gallery'},
        {type: 'faq'},
        {type: 'contactForm'},
      ],
    },
    {
      name: 'internalLinkSuggestions',
      title: 'Internal Link Suggestions',
      type: 'string',
      components: {
        input: InternalLinkSuggestions as any,
      },
      hidden: ({document}) => !document._id,
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
  ],
})
