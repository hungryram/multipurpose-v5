import {defineType} from 'sanity'
import {sectionSettingsFields} from '../fragments/sectionSettings'
import {AIImageInput} from '../../components/AIImageInput'

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
      components: {
        input: AIImageInput,
      },
      hidden: ({parent}) => parent?.layout !== 'split',
      description: 'Used in split layout',
      group: 'content',
    },
    {
      name: 'imageSize',
      title: 'Image Size',
      type: 'string',
      options: {
        list: [
          {title: 'Small (1/3 width)', value: '33'},
          {title: 'Medium (1/2 width)', value: '50'},
          {title: 'Large (2/3 width)', value: '66'},
          {title: 'Custom', value: 'custom'},
        ],
      },
      initialValue: '50',
      hidden: ({parent}) => parent?.layout !== 'split',
      description: 'Image width as percentage',
      group: 'settings',
    },
    {
      name: 'imageSizeCustom',
      title: 'Custom Image Width (%)',
      type: 'number',
      description: 'Enter image width percentage (1-99)',
      validation: (Rule: any) => Rule.min(1).max(99).integer(),
      hidden: ({parent}: any) => parent?.imageSize !== 'custom',
      group: 'settings',
    },
    {
      name: 'imageFit',
      title: 'Image Fit',
      type: 'string',
      options: {
        list: [
          {title: 'Cover (fill container, may crop)', value: 'cover'},
          {title: 'Contain (show full image)', value: 'contain'},
        ],
      },
      initialValue: 'cover',
      hidden: ({parent}) => parent?.layout !== 'split',
      description: 'How the image should fit in its container',
      group: 'settings',
    },
    {
      name: 'imageHeight',
      title: 'Image Height',
      type: 'string',
      options: {
        list: [
          {title: 'Small (300px)', value: '300'},
          {title: 'Medium (400px)', value: '400'},
          {title: 'Large (500px)', value: '500'},
          {title: 'Extra Large (600px)', value: '600'},
          {title: 'Custom', value: 'custom'},
        ],
      },
      initialValue: '500',
      hidden: ({parent}) => parent?.layout !== 'split',
      description: 'Height of the image container',
      group: 'settings',
    },
    {
      name: 'imageHeightCustom',
      title: 'Custom Image Height',
      type: 'string',
      description: 'Enter height with unit (e.g., "450px", "30rem", "50vh")',
      validation: (Rule: any) =>
        Rule.custom((value: string | undefined) => {
          if (!value) return true
          if (!/^\d+(\.\d+)?(px|rem|em|vh)$/.test(value)) {
            return 'Please enter a valid CSS value (e.g., "450px", "30rem", "50vh")'
          }
          return true
        }),
      hidden: ({parent}: any) => parent?.imageHeight !== 'custom',
      group: 'settings',
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
      media: 'image',
      layout: 'layout',
    },
    prepare({content, media, layout}) {
      const block = (content || []).find((block: any) => block._type === 'block')
      const title = block?.children?.[0]?.text
      return {
        title: title || 'Call to Action',
        subtitle: `CTA - ${layout || 'centered'}`,
        media,
      }
    },
  },
})
