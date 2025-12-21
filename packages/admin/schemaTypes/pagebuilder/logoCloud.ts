import {defineType} from 'sanity'
import {sectionSettingsFields} from '../fragments/sectionSettings'

export default defineType({
  title: 'Logo Cloud',
  name: 'logoCloud',
  type: 'object',
  groups: [
    {title: 'Content', name: 'content'},
    {title: 'Settings', name: 'settings'},
  ],
  fields: [
    {
      title: 'Layout Type',
      name: 'layout',
      type: 'string',
      options: {
        list: [
          {title: 'Grid', value: 'grid'},
          {title: 'Carousel', value: 'carousel'},
        ],
      },
      initialValue: 'grid',
      group: 'settings',
    },
    {
      title: 'Content',
      name: 'content',
      type: 'blockContent',
      description: 'Heading above the logos',
      group: 'content',
    },
    {
      title: 'Logos',
      name: 'logos',
      type: 'array',
      of: [
        {
          title: 'Logo',
          type: 'object',
          fields: [
            {
              title: 'Image',
              name: 'image',
              type: 'image',
              validation: (Rule) => Rule.required(),
            },
            {
              title: 'Company Name',
              name: 'name',
              type: 'string',
              description: 'For accessibility',
            },
            {
              title: 'Website URL',
              name: 'url',
              type: 'url',
              description: 'Optional link to company website',
            },
          ],
          preview: {
            select: {
              title: 'name',
              media: 'image',
            },
          },
        },
      ],
      group: 'content',
      validation: (Rule) => Rule.required().min(1),
    },
    {
      title: 'Columns',
      name: 'columns',
      type: 'number',
      description: 'Number of columns in grid layout (2-6)',
      validation: (Rule) => Rule.min(2).max(6),
      initialValue: 4,
      hidden: ({parent}) => parent?.layout === 'carousel',
      group: 'settings',
    },
    {
      title: 'Grayscale',
      name: 'grayscale',
      type: 'boolean',
      description: 'Show logos in grayscale, color on hover',
      initialValue: true,
      group: 'settings',
    },
    ...sectionSettingsFields,
  ],
  preview: {
    select: {
      logos: 'logos',
      layout: 'layout',
    },
    prepare({logos, layout}) {
      return {
        title: 'Logo Cloud',
        subtitle: logos ? `${logos.length} logos - ${layout}` : 'No logos',
      }
    },
  },
})
