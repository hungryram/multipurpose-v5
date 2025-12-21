import {defineType} from 'sanity'
import {sectionSettingsFields} from '../fragments/sectionSettings'

export default defineType({
  name: 'testimonials',
  title: 'Testimonials',
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
          {title: 'Carousel', value: 'carousel'},
          {title: 'Single Column', value: 'column'},
        ],
      },
      initialValue: 'grid',
      group: 'settings',
    },
    {
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'quote',
              title: 'Quote',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'author',
              title: 'Author Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'role',
              title: 'Role/Title',
              type: 'string',
            },
            {
              name: 'company',
              title: 'Company',
              type: 'string',
            },
            {
              name: 'image',
              title: 'Author Image',
              type: 'image',
              options: {
                hotspot: true,
              },
            },
            {
              name: 'rating',
              title: 'Rating (1-5)',
              type: 'number',
              validation: (Rule) => Rule.min(1).max(5),
            },
          ],
          preview: {
            select: {
              title: 'author',
              subtitle: 'company',
              media: 'image',
            },
          },
        },
      ],
      group: 'content',
    },
    {
      name: 'columns',
      title: 'Number of Columns',
      type: 'number',
      options: {
        list: [
          {title: '1 Column', value: 1},
          {title: '2 Columns', value: 2},
          {title: '3 Columns', value: 3},
        ],
      },
      initialValue: 3,
      group: 'settings',
    },
    {
      name: 'showRatings',
      title: 'Show Ratings',
      type: 'boolean',
      initialValue: true,
      group: 'settings',
    },
    ...sectionSettingsFields,
  ],
  preview: {
    select: {
      content: 'content',
      testimonials: 'testimonials',
    },
    prepare({content, testimonials}) {
      const block = (content || []).find((block: any) => block._type === 'block')
      const title = block?.children?.[0]?.text
      return {
        title: title || 'Testimonials Section',
        subtitle: `${testimonials?.length || 0} testimonials`,
      }
    },
  },
})
