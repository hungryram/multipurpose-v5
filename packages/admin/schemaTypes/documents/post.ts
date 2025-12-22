import {defineType} from 'sanity'
import {InternalLinkSuggestions} from '../../components/InternalLinkSuggestions'
import {AltTextGenerator} from '../../components/AltTextGenerator'
import {ExcerptGenerator} from '../../components/ExcerptGenerator'
import {AIImageInput} from '../../components/AIImageInput'

export default defineType({
  name: 'post',
  title: 'Blog Posts',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Brief summary of the post (used in listings and meta description)',
      components: {
        input: ExcerptGenerator,
      },
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'author'}],
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      components: {
        input: AIImageInput,
      },
      fields: [
        {
          name: 'altText',
          title: 'Alt Text',
          type: 'string',
          description: 'Important for SEO and accessibility',
          components: {
            input: AltTextGenerator,
          },
        },
      ],
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'category'}]}],
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'tag'}]}],
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
    {
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    },
    {
      name: 'internalLinkSuggestions',
      title: 'Internal Link Suggestions',
      type: 'string',
      components: {
        input: InternalLinkSuggestions as any,
      },
      hidden: ({document}) => !document._id,
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
  ],
  orderings: [
    {
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
})
