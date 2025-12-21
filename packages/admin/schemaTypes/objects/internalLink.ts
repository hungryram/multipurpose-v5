import {defineType} from 'sanity'

export default defineType({
  name: 'internalLink',
  type: 'object',
  title: 'Internal Link',
  fields: [
    {
      name: 'reference',
      type: 'reference',
      title: 'Page',
      to: [
        {type: 'home'},
        {type: 'page'},
        {type: 'post'},
        {type: 'service'},
        {type: 'blogIndex'},
        {type: 'servicesIndex'},
      ],
    },
  ],
})
