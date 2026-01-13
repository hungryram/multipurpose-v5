import {defineType} from 'sanity'
import {colorReferenceField, customColorField} from './colorReference'

// Export just the block object for inline use in 'of' arrays
export const blockContent = {
  type: 'block',
  marks: {
    decorators: [
      {title: 'Strong', value: 'strong'},
      {title: 'Emphasis', value: 'em'},
      {title: 'Code', value: 'code'},
      {title: 'Underline', value: 'underline'},
      {title: 'Strike', value: 'strike-through'},
    ],
    annotations: [
      {
        name: 'textColor',
        type: 'object',
        title: 'Text Color',
        icon: () => '🎨',
        fields: [
          {
            ...colorReferenceField,
            name: 'colorRef',
            title: 'Color',
            description: 'Select text color',
          },
          {
            ...customColorField,
            name: 'customColor',
            title: 'Custom Color',
            hidden: ({parent}: any) => parent?.colorRef !== 'custom',
          },
        ],
      },
      {
        name: 'fontSize',
        type: 'object',
        title: 'Font Size',
        icon: () => '📏',
        fields: [
          {
            name: 'size',
            type: 'string',
            title: 'Size',
            options: {
              list: [
                {title: 'Extra Small (0.75rem / 12px)', value: 'xs'},
                {title: 'Small (0.875rem / 14px)', value: 'sm'},
                {title: 'Normal (1rem / 16px)', value: 'base'},
                {title: 'Medium (1.125rem / 18px)', value: 'lg'},
                {title: 'Large (1.25rem / 20px)', value: 'xl'},
                {title: 'Extra Large (1.5rem / 24px)', value: '2xl'},
                {title: '2X Large (1.875rem / 30px)', value: '3xl'},
                {title: '3X Large (2.25rem / 36px)', value: '4xl'},
                {title: '4X Large (3rem / 48px)', value: '5xl'},
                {title: '5X Large (3.75rem / 60px)', value: '6xl'},
              ],
              layout: 'dropdown',
            },
            initialValue: 'base',
          },
        ],
      },
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
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility',
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
          description: 'Optional caption displayed below the image',
        },
        {
          name: 'size',
          type: 'string',
          title: 'Size',
          description: 'Image width',
          options: {
            list: [
              {title: 'Small (400px)', value: 'small'},
              {title: 'Medium (600px)', value: 'medium'},
              {title: 'Large (800px)', value: 'large'},
              {title: 'Full Width', value: 'full'},
              {title: 'Custom', value: 'custom'},
            ],
          },
          initialValue: 'large',
        },
        {
          name: 'customWidth',
          type: 'number',
          title: 'Custom Width (px)',
          description: 'Width in pixels',
          validation: (Rule: any) => Rule.min(100).max(2000),
          hidden: ({parent}: any) => parent?.size !== 'custom',
        },
        {
          name: 'alignment',
          type: 'string',
          title: 'Alignment',
          description: 'Image alignment',
          options: {
            list: [
              {title: 'Left', value: 'left'},
              {title: 'Center', value: 'center'},
              {title: 'Right', value: 'right'},
            ],
          },
          initialValue: 'center',
        },
      ],
    },
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
