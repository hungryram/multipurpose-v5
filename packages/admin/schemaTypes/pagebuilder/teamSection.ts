import {defineType} from 'sanity'
import {sectionSettingsFields} from '../fragments/sectionSettings'

export default defineType({
  name: 'teamSection',
  title: 'Team Section',
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
          {title: 'List', value: 'list'},
          {title: 'Carousel', value: 'carousel'},
        ],
      },
      initialValue: 'grid',
      group: 'settings',
    },
    {
      name: 'teamMembers',
      title: 'Team Members',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'team'}]}],
      group: 'content',
      description: 'Select team members to display, or leave empty to show all',
    },
    {
      name: 'limit',
      title: 'Limit Number of Members',
      type: 'number',
      group: 'settings',
      description: 'Leave empty to show all selected members',
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
      name: 'showSocial',
      title: 'Show Social Links',
      type: 'boolean',
      initialValue: true,
      group: 'settings',
    },

    ...sectionSettingsFields,
  ],
  preview: {
    select: {
      content: 'content',
      members: 'teamMembers',
    },
    prepare({content, members}) {
      const block = (content || []).find((block: any) => block._type === 'block')
      const title = block?.children?.[0]?.text
      return {
        title: title || 'Team Section',
        subtitle: members?.length ? `${members.length} selected members` : 'All team members',
      }
    },
  },
})
