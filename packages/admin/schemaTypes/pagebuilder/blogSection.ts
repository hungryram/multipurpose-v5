import {defineType} from 'sanity'
import {sectionSettingsFields} from '../fragments/sectionSettings'

export default defineType({
  name: 'blogSection',
  title: 'Blog Section',
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
          {title: 'Featured', value: 'featured'},
          {title: 'Carousel', value: 'carousel'},
        ],
      },
      initialValue: 'grid',
      group: 'settings',
    },
    {
      name: 'filterBy',
      title: 'Filter Posts By',
      type: 'string',
      options: {
        list: [
          {title: 'Latest Posts', value: 'latest'},
          {title: 'Category', value: 'category'},
          {title: 'Manual Selection', value: 'manual'},
        ],
      },
      initialValue: 'latest',
      group: 'settings',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
      group: 'settings',
      hidden: ({parent}) => parent?.filterBy !== 'category',
    },
    {
      name: 'posts',
      title: 'Select Posts',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'post'}]}],
      group: 'content',
      hidden: ({parent}) => parent?.filterBy !== 'manual',
    },
    {
      name: 'limit',
      title: 'Number of Posts',
      type: 'number',
      initialValue: 6,
      group: 'settings',
      hidden: ({parent}) => parent?.filterBy === 'manual',
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
      title: 'Show Post Excerpt',
      type: 'boolean',
      initialValue: true,
      group: 'settings',
    },
    {
      name: 'showReadMore',
      title: 'Show Read More Button',
      type: 'boolean',
      initialValue: true,
      group: 'settings',
    },

    ...sectionSettingsFields,
  ],
  preview: {
    select: {
      content: 'content',
      filterBy: 'filterBy',
      limit: 'limit',
    },
    prepare({content, filterBy, limit}) {
      const block = (content || []).find((block: any) => block._type === 'block')
      const title = block?.children?.[0]?.text
      return {
        title: title || 'Blog Section',
        subtitle: `${filterBy} - ${limit || 'all'} posts`,
      }
    },
  },
})
