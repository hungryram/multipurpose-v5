import {defineType} from 'sanity'

export default defineType({
  name: 'link',
  type: 'object',
  title: 'Link',
  fields: [
    {
      name: 'href',
      type: 'string',
      title: 'URL',
      description: 'Internal path (e.g., /blog/article-slug) or external URL',
    },
    {
      name: 'linkType',
      type: 'string',
      title: 'Link Type',
      options: {
        list: [
          {title: 'Internal Page', value: 'internal'},
          {title: 'External URL', value: 'external'},
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
      hidden: ({parent}) => !!parent?.href, // Hide if href is set (AI-generated)
    },
    {
      name: 'internalLink',
      type: 'reference',
      title: 'Internal Page',
      to: [
        {type: 'home'},
        {type: 'page'},
        {type: 'post'},
        {type: 'service'},
        {type: 'blogIndex'},
        {type: 'servicesIndex'},
      ],
      hidden: ({parent}) => parent?.linkType !== 'internal',
    },
    {
      name: 'externalUrl',
      type: 'url',
      title: 'External URL',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https', 'mailto', 'tel'],
        }),
      hidden: ({parent}) => parent?.linkType !== 'external',
    },
  ],
})
