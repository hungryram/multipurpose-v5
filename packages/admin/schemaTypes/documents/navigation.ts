import {defineType} from 'sanity'

export default defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Navigation Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'items',
      title: 'Navigation Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Link Text',
              type: 'string',
            },
            {
              name: 'linkType',
              title: 'Link Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Internal', value: 'internal'},
                  {title: 'External', value: 'external'},
                  {title: 'Path', value: 'path'},
                ],
              },
              initialValue: 'internal',
            },
            {
              name: 'internalLink',
              title: 'Internal Link',
              type: 'reference',
              to: [{type: 'home'}, {type: 'blogIndex'}, {type: 'page'}, {type: 'post'}, {type: 'service'}],
              hidden: ({parent}) => parent?.linkType !== 'internal',
            },
            {
              name: 'internalPath',
              title: 'Internal Path',
              type: 'string',
              description: 'e.g., /about, /contact',
              hidden: ({parent}) => parent?.linkType !== 'path',
            },
            {
              name: 'externalUrl',
              title: 'External URL',
              type: 'url',
              hidden: ({parent}) => parent?.linkType !== 'external',
            },
            {
              name: 'newTab',
              title: 'Open in New Tab',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'subMenu',
              title: 'Submenu Items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {name: 'text', title: 'Link Text', type: 'string'},
                    {
                      name: 'linkType',
                      title: 'Link Type',
                      type: 'string',
                      options: {
                        list: [
                          {title: 'Internal', value: 'internal'},
                          {title: 'External', value: 'external'},
                          {title: 'Path', value: 'path'},
                        ],
                      },
                      initialValue: 'internal',
                    },
                    {
                      name: 'internalLink',
                      type: 'reference',
                      to: [{type: 'home'}, {type: 'blogIndex'}, {type: 'page'}, {type: 'post'}, {type: 'service'}],
                      hidden: ({parent}) => parent?.linkType !== 'internal',
                    },
                    {
                      name: 'internalPath',
                      type: 'string',
                      hidden: ({parent}) => parent?.linkType !== 'path',
                    },
                    {
                      name: 'externalUrl',
                      type: 'url',
                      hidden: ({parent}) => parent?.linkType !== 'external',
                    },
                    {name: 'newTab', type: 'boolean', initialValue: false},
                  ],
                },
              ],
            },
          ],
          preview: {
            select: {
              title: 'text',
            },
          },
        },
      ],
    },
  ],
})
