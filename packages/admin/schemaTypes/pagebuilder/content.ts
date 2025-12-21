import {defineType} from 'sanity'
import {sectionSettingsFields} from '../fragments/sectionSettings'

export default defineType({
  name: 'content',
  title: 'Content Section',
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
      description: 'Main content with heading and body text',
      group: 'content',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      group: 'content',
    },
    {
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Image Left', value: 'imageLeft'},
          {title: 'Image Right', value: 'imageRight'},
          {title: 'Image Top', value: 'imageTop'},
          {title: 'Image Bottom', value: 'imageBottom'},
          {title: 'Full Width Image (Text Overlay)', value: 'fullWidthImage'},
          {title: 'Cards (Side by Side)', value: 'cards'},
          {title: 'Text Only', value: 'textOnly'},
        ],
      },
      initialValue: 'imageLeft',
      group: 'settings',
    },
    {
      name: 'button',
      title: 'Call to Action Button',
      type: 'button',
      group: 'content',
    },
    ...sectionSettingsFields,
  ],
  preview: {
    select: {
      content: 'content',
      media: 'image',
    },
    prepare({content, media}) {
      const block = (content || []).find((block: any) => block._type === 'block')
      const title = block?.children?.[0]?.text
      return {
        title: title || 'Content Section',
        subtitle: 'Content',
        media,
      }
    },
  },
})
