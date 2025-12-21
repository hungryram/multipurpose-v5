import {defineType} from 'sanity'
import {InternalLinkSuggestions} from '../../components/InternalLinkSuggestions'

export default defineType({
  name: 'page',
  title: 'Pages',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
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
