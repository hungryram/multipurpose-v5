import {defineType} from 'sanity'
import {sectionSettingsFields} from '../fragments/sectionSettings'

export default defineType({
  name: 'ctaSection',
  title: 'Call to Action',
  type: 'object',
  groups: [
    {name: 'content', title: 'Content'},
    {name: 'settings', title: 'Settings'},
  ],
  fields: [
    {
      name: 'content',
      title: 'Content',
      type: 'blockContent',
      group: 'content',
    },
    {
      name: 'layout',
      title: 'Layout Style',
      type: 'string',
      options: {
        list: [
          {title: 'Centered', value: 'centered'},
          {title: 'Banner (Full Width)', value: 'banner'},
          {title: 'Split (Text & Image)', value: 'split'},
          {title: 'Card (Contained)', value: 'card'},
        ],
      },
      initialValue: 'centered',
      group: 'settings',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      hidden: ({parent}) => parent?.layout !== 'split',
      description: 'Used in split layout',
      group: 'content',
    },
    {
      name: 'reverseColumn',
      title: 'Reverse Column Order',
      type: 'boolean',
      initialValue: false,
      hidden: ({parent}) => parent?.layout !== 'split',
      description: 'Put image on the left and text on the right',
      group: 'settings',
    },
    {
      name: 'spacing',
      title: 'Image/Text Spacing',
      type: 'string',
      options: {
        list: [
          {title: 'Small', value: 'small'},
          {title: 'Medium', value: 'medium'},
          {title: 'Large', value: 'large'},
          {title: 'Extra Large', value: 'xlarge'},
        ],
      },
      initialValue: 'medium',
      hidden: ({parent}) => parent?.layout !== 'split',
      description: 'Space between image and text',
      group: 'settings',
    },
    ...sectionSettingsFields,
  ],
  preview: {
    select: {
      content: 'content',
    },
    prepare({content}) {
      const block = (content || []).find((block: any) => block._type === 'block')
      const title = block?.children?.[0]?.text
      return {
        title: title || 'Call to Action',
        subtitle: 'CTA',
      }
    },
  },
})
