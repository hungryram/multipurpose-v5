import {defineType} from 'sanity'
import {sectionSettingsFields} from '../fragments/sectionSettings'
import {blockContent} from '../fragments/blockContent'

export default defineType({
  title: 'Accordion',
  name: 'accordion',
  type: 'object',
  groups: [
    {title: 'Content', name: 'content'},
    {title: 'Settings', name: 'settings'},
  ],
  fields: [
    {
      title: 'Content',
      name: 'content',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Heading above the accordion',
      group: 'content',
    },
    {
      title: 'Items',
      name: 'items',
      type: 'array',
      of: [
        {
          title: 'Item',
          type: 'object',
          fields: [
            {
              title: 'Title',
              name: 'title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              title: 'Content',
              name: 'content',
              type: 'array',
              of: [{type: 'block'}],
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'title',
            },
          },
        },
      ],
      group: 'content',
      validation: (Rule) => Rule.required().min(1),
    },
    {
      title: 'Allow Multiple Open',
      name: 'allowMultiple',
      type: 'boolean',
      description: 'Allow multiple accordion items to be open at once',
      initialValue: false,
      group: 'settings',
    },
    {
      title: 'First Item Open by Default',
      name: 'firstOpen',
      type: 'boolean',
      description: 'Open the first item by default',
      initialValue: true,
      group: 'settings',
    },
    ...sectionSettingsFields,
  ],
  preview: {
    select: {
      items: 'items',
    },
    prepare({items}) {
      return {
        title: 'Accordion',
        subtitle: items ? `${items.length} items` : 'No items',
      }
    },
  },
})
