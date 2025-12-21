import {defineType} from 'sanity'
import {sectionSettingsFields} from '../fragments/sectionSettings'
import {blockContent} from '../fragments/blockContent'

export default defineType({
  title: 'Featured Grid',
  name: 'featuredGrid',
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
          {title: 'Text Overlay on Image', value: 'textOverlay'},
          {title: 'Text Only', value: 'textOnly'},
          {title: 'Text Below Image', value: 'textBelow'},
          {title: 'Image Only', value: 'imageOnly'},
        ],
      },
      initialValue: 'textBelow',
      group: 'settings',
    },
    {
      title: 'Content',
      name: 'content',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Heading and description above the grid',
      group: 'content',
    },
    {
      title: 'Feature Blocks',
      name: 'blocks',
      type: 'array',
      group: 'content',
      of: [
        {
          title: 'Block',
          type: 'object',
          fields: [
            {
              title: 'Image',
              name: 'image',
              type: 'image',
            },
            {
              title: 'Heading',
              name: 'heading',
              type: 'string',
            },
            {
              title: 'Content',
              name: 'content',
              type: 'array',
              of: [{type: 'block'}],
            },
            {
              title: 'Button',
              name: 'button',
              type: 'button',
            },
          ],
          preview: {
            select: {
              title: 'heading',
              media: 'image',
            },
          },
        },
      ],
    },
    {
      title: 'Columns',
      name: 'columns',
      type: 'number',
      description: 'Number of columns in the grid (1-4)',
      validation: (Rule) => Rule.min(1).max(4),
      initialValue: 3,
      group: 'settings',
    },
    ...sectionSettingsFields,
  ],
  preview: {
    select: {
      blocks: 'blocks',
    },
    prepare({blocks}) {
      return {
        title: 'Featured Grid',
        subtitle: blocks ? `${blocks.length} blocks` : 'No blocks',
      }
    },
  },
})
