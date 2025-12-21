import {defineType} from 'sanity'
import {sectionSettingsFields} from '../fragments/sectionSettings'

export default defineType({
  name: 'servicesSection',
  title: 'Services Section',
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
        ],
      },
      initialValue: 'grid',
      group: 'settings',
    },
    {
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'service'}]}],
      group: 'content',
      description: 'Select services to display, or leave empty to show all',
    },
    {
      name: 'limit',
      title: 'Limit Number of Services',
      type: 'number',
      group: 'settings',
      description: 'Leave empty to show all selected services',
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
    },
    {
      name: 'showExcerpt',
      title: 'Show Service Excerpt',
      type: 'boolean',
      initialValue: true,
      group: 'settings',
    },

    ...sectionSettingsFields,
  ],
  preview: {
    select: {
      content: 'content',
      services: 'services',
    },
    prepare({content, services}) {
      const block = (content || []).find((block: any) => block._type === 'block')
      const title = block?.children?.[0]?.text
      return {
        title: title || 'Services Section',
        subtitle: services?.length ? `${services.length} selected services` : 'All services',
      }
    },
  },
})
