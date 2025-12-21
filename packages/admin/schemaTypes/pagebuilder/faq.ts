import {defineType} from 'sanity'
import {sectionSettingsFields} from '../fragments/sectionSettings'
import {blockContent} from '../fragments/blockContent'

export default defineType({
  name: 'faq',
  title: 'FAQ / Accordion',
  type: 'object',
  groups: [
    {name: 'content', title: 'Content'},
    {name: 'settings', title: 'Settings'},
  ],
  fields: [
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Section heading and description',
      group: 'content',
    },
    {
      name: 'items',
      title: 'FAQ Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'answer',
              title: 'Answer',
              type: 'array',
              of: [{type: 'block'}],
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'question',
            },
          },
        },
      ],
      group: 'content',
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: 'layout',
      title: 'Layout Type',
      type: 'string',
      options: {
        list: [
          {title: 'Single Column', value: 'single'},
          {title: 'Two Columns', value: 'two-column'},
        ],
      },
      initialValue: 'single',
      group: 'settings',
    },
    {
      name: 'defaultOpen',
      title: 'Default State',
      type: 'string',
      options: {
        list: [
          {title: 'All Closed', value: 'closed'},
          {title: 'First Item Open', value: 'first'},
          {title: 'All Open', value: 'all'},
        ],
      },
      initialValue: 'closed',
      group: 'settings',
    },
    {
      name: 'allowMultiple',
      title: 'Allow Multiple Items Open',
      type: 'boolean',
      initialValue: false,
      group: 'settings',
    },

    ...sectionSettingsFields,
  ],
  preview: {
    select: {
      content: 'content',
      items: 'items',
    },
    prepare({content, items}) {
      const block = (content || []).find((block: any) => block._type === 'block')
      const title = block?.children?.[0]?.text
      return {
        title: title || 'FAQ Section',
        subtitle: `${items?.length || 0} questions`,
      }
    },
  },
})
