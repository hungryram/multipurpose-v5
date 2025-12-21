import {defineType} from 'sanity'
import {blockContent} from '../fragments/blockContent'

export default defineType({
  name: 'team',
  title: 'Team Members',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
      },
    },
    {
      name: 'position',
      title: 'Position/Title',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [blockContent],
    },
    {
      name: 'social',
      title: 'Social Links',
      type: 'object',
      fields: [
        {name: 'linkedin', title: 'LinkedIn', type: 'url'},
        {name: 'twitter', title: 'Twitter/X', type: 'url'},
        {name: 'email', title: 'Email', type: 'email'},
      ],
    },
  ],
})
