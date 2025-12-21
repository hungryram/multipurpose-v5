import {defineType} from 'sanity'

export default defineType({
  name: 'home',
  title: 'Home Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'Home Page',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
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
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Home Page',
      }
    },
  },
})
