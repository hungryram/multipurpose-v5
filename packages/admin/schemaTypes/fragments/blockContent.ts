import {defineType} from 'sanity'
import {colorReferenceField, customColorField} from './colorReference'

// Export just the block object for inline use in 'of' arrays
export const blockContent = {
  type: 'block',
  marks: {
    annotations: [
      {
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
            hidden: ({parent}: any) => !!parent?.href,
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
            hidden: ({parent}: any) => parent?.linkType !== 'internal',
          },
          {
            name: 'externalUrl',
            type: 'url',
            title: 'External URL',
            validation: (Rule: any) =>
              Rule.uri({
                scheme: ['http', 'https', 'mailto', 'tel'],
              }),
            hidden: ({parent}: any) => parent?.linkType !== 'external',
          },
          {
            name: 'newTab',
            type: 'boolean',
            title: 'Open in new tab',
            initialValue: false,
          },
        ],
      },
    ],
  },
}

// Reusable portable text editor with block content and custom components
export default defineType({
  name: 'blockContent',
  title: 'Block Content',
  type: 'array',
  of: [
    blockContent,
    {
      name: 'breadcrumb',
      type: 'object',
      title: 'Breadcrumb',
      fields: [
        {
          name: 'showBreadcrumb',
          type: 'boolean',
          title: 'Show Breadcrumb',
          description: 'Display breadcrumb navigation',
          initialValue: true,
        },
        {
          name: 'separator',
          type: 'string',
          title: 'Separator',
          description: 'Choose the separator between breadcrumb items',
          options: {
            list: [
              {title: 'Slash (/)', value: 'slash'},
              {title: 'Chevron (›)', value: 'chevron'},
              {title: 'Arrow (→)', value: 'arrow'},
              {title: 'Dot (•)', value: 'dot'},
              {title: 'Pipe (|)', value: 'pipe'},
            ],
          },
          initialValue: 'chevron',
        },
        {
          name: 'alignment',
          type: 'string',
          title: 'Alignment',
          description: 'Horizontal alignment of breadcrumbs',
          options: {
            list: [
              {title: 'Left', value: 'left'},
              {title: 'Center', value: 'center'},
              {title: 'Right', value: 'right'},
            ],
            layout: 'radio',
          },
          initialValue: 'left',
        },
        {
          ...colorReferenceField,
          name: 'colorRef',
          title: 'Color',
          description: 'Color for the entire breadcrumb',
        },
        {
          ...customColorField,
          name: 'customColor',
          title: 'Custom Color',
          hidden: ({parent}: any) => parent?.colorRef !== 'custom',
        },
      ],
      preview: {
        select: {
          separator: 'separator',
          alignment: 'alignment',
        },
        prepare({separator, alignment}) {
          const separatorIcon = {
            slash: '/',
            chevron: '›',
            arrow: '→',
            dot: '•',
            pipe: '|',
          }[separator || 'chevron']
          return {
            title: `🏠 Breadcrumb Navigation (${separatorIcon} ${alignment || 'left'})`,
          }
        },
      },
    },
  ],
})
