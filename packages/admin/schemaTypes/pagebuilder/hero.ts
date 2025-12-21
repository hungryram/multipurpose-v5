import {defineType} from 'sanity'
import {sectionSettingsFields} from '../fragments/sectionSettings'
import {colorReferenceField, customColorField} from '../fragments/colorReference'

export default defineType({
  name: 'hero',
  title: 'Hero Section',
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
      description: 'Heading and tagline text',
      group: 'content',
    },
    {
      name: 'image',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      group: 'content',
    },
    {
      name: 'height',
      title: 'Section Height',
      type: 'string',
      options: {
        list: [
          {title: 'Small (400px)', value: 'small'},
          {title: 'Medium (600px)', value: 'medium'},
          {title: 'Large (800px)', value: 'large'},
          {title: 'Full Screen', value: 'full'},
        ],
      },
      initialValue: 'large',
      group: 'settings',
    },
    {
      ...colorReferenceField,
      name: 'overlayColorRef',
      title: 'Image Overlay Color',
      description: 'Select overlay color',
      group: 'settings',
    },
    {
      ...customColorField,
      name: 'overlayCustomColor',
      title: 'Custom Overlay Color',
      hidden: ({parent}: any) => parent?.overlayColorRef !== 'custom',
      group: 'settings',
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
        title: title || 'Hero Section',
        subtitle: 'Hero',
        media,
      }
    },
  },
})
