import {defineType} from 'sanity'
import {sectionSettingsFields} from '../fragments/sectionSettings'

export default defineType({
  name: 'gallery',
  title: 'Image Gallery',
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
      description: 'Section heading and description',
      group: 'content',
    },
    {
      name: 'layout',
      title: 'Layout Type',
      type: 'string',
      options: {
        list: [
          {title: 'Grid', value: 'grid'},
          {title: 'Masonry', value: 'masonry'},
          {title: 'Carousel', value: 'carousel'},
        ],
      },
      initialValue: 'grid',
      group: 'settings',
    },
    {

      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            },
          ],
        },
      ],
      group: 'content',
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: 'columns',
      title: 'Number of Columns',
      type: 'number',
      options: {
        list: [
          {title: '2 Columns', value: 2},
          {title: '3 Columns', value: 3},
          {title: '4 Columns', value: 4},
        ],
      },
      initialValue: 3,
      group: 'settings',
      hidden: ({parent}) => parent?.layout === 'carousel',
    },
    {
      name: 'aspectRatio',
      title: 'Image Aspect Ratio',
      type: 'string',
      options: {
        list: [
          {title: 'Square (1:1)', value: '1/1'},
          {title: 'Landscape (4:3)', value: '4/3'},
          {title: 'Landscape (16:9)', value: '16/9'},
          {title: 'Portrait (3:4)', value: '3/4'},
          {title: 'Original', value: 'auto'},
        ],
      },
      initialValue: '1/1',
      group: 'settings',
    },
    {
      name: 'enableLightbox',
      title: 'Enable Lightbox',
      type: 'boolean',
      initialValue: true,
      group: 'settings',
    },

    ...sectionSettingsFields,
  ],
  preview: {
    select: {
      content: 'content',
      images: 'images',
      media: 'images.0',
    },
    prepare({content, images, media}) {
      const block = (content || []).find((block: any) => block._type === 'block')
      const title = block?.children?.[0]?.text
      return {
        title: title || 'Image Gallery',
        subtitle: `${images?.length || 0} images`,
        media,
      }
    },
  },
})
