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
      type: 'blockContent',
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
              options: {
                hotspot: true,
              },
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
    {
      title: 'Gap Size',
      name: 'gap',
      type: 'string',
      description: 'Space between grid items',
      options: {
        list: [
          {title: 'No Gap', value: 'none'},
          {title: 'Small', value: 'small'},
          {title: 'Medium', value: 'medium'},
          {title: 'Large', value: 'large'},
        ],
      },
      initialValue: 'medium',
      group: 'settings',
    },
    {
      title: 'Image Height',
      name: 'imageHeight',
      type: 'string',
      description: 'Height of images in the grid',
      options: {
        list: [
          {title: 'Small (200px)', value: 'small'},
          {title: 'Medium (256px)', value: 'medium'},
          {title: 'Large (320px)', value: 'large'},
          {title: 'Extra Large (400px)', value: 'xlarge'},
          {title: 'Auto (Original Ratio)', value: 'auto'},
        ],
      },
      initialValue: 'medium',
      group: 'settings',
    },
    {
      title: 'Heading Color',
      name: 'headingColorRef',
      type: 'string',
      description: 'Color for all block headings',
      options: {
        list: [
          {title: 'Default', value: ''},
          {title: 'Accent', value: 'accent'},
          {title: 'Primary', value: 'primary'},
          {title: 'Secondary', value: 'secondary'},
          {title: 'Custom', value: 'custom'},
        ],
      },
      group: 'settings',
    },
    {
      title: 'Custom Heading Color',
      name: 'headingCustomColor',
      type: 'color',
      description: 'Custom color override for headings',
      hidden: ({parent}) => parent?.headingColorRef !== 'custom',
      group: 'settings',
    },
    {
      title: 'Content Color',
      name: 'contentColorRef',
      type: 'string',
      description: 'Color for all block content text',
      options: {
        list: [
          {title: 'Default', value: ''},
          {title: 'Accent', value: 'accent'},
          {title: 'Primary', value: 'primary'},
          {title: 'Secondary', value: 'secondary'},
          {title: 'Custom', value: 'custom'},
        ],
      },
      group: 'settings',
    },
    {
      title: 'Custom Content Color',
      name: 'contentCustomColor',
      type: 'color',
      description: 'Custom color override for content',
      hidden: ({parent}) => parent?.contentColorRef !== 'custom',
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
