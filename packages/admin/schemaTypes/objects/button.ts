import {defineType} from 'sanity'
import {colorReferenceField, customColorField} from '../fragments/colorReference'

export default defineType({
  name: 'button',
  title: 'Button',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [
    {
      name: 'text',
      title: 'Button Text',
      type: 'string',
    },
    {
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      options: {
        list: [
          {title: 'Internal', value: 'internal'},
          {title: 'External', value: 'external'},
          {title: 'Path', value: 'path'},
        ],
      },
      initialValue: 'internal',
    },
    {
      name: 'internalLink',
      title: 'Internal Link',
      type: 'reference',
      to: [{type: 'home'}, {type: 'blogIndex'}, {type: 'page'}, {type: 'post'}, {type: 'service'}],
      hidden: ({parent}) => parent?.linkType !== 'internal',
    },
    {
      name: 'internalPath',
      title: 'Internal Path',
      type: 'string',
      description: 'e.g., /about, /contact',
      hidden: ({parent}) => parent?.linkType !== 'path',
    },
    {
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      hidden: ({parent}) => parent?.linkType !== 'external',
    },
    {
      name: 'newTab',
      title: 'Open in New Tab',
      type: 'boolean',
      initialValue: false,
    },
    {
      ...colorReferenceField,
      name: 'bgColorRef',
      title: 'Background Color',
    },
    {
      ...customColorField,
      name: 'bgCustomColor',
      title: 'Custom Background Color',
      hidden: ({parent}) => parent?.bgColorRef !== 'custom',
    },
    {
      ...colorReferenceField,
      name: 'textColorRef',
      title: 'Text Color',
    },
    {
      ...customColorField,
      name: 'textCustomColor',
      title: 'Custom Text Color',
      hidden: ({parent}) => parent?.textColorRef !== 'custom',
    },
    {
      ...colorReferenceField,
      name: 'borderColorRef',
      title: 'Border Color',
    },
    {
      ...customColorField,
      name: 'borderCustomColor',
      title: 'Custom Border Color',
      hidden: ({parent}) => parent?.borderColorRef !== 'custom',
    },
    {
      ...colorReferenceField,
      name: 'hoverBgColorRef',
      title: 'Hover Background Color',
    },
    {
      ...customColorField,
      name: 'hoverBgCustomColor',
      title: 'Custom Hover Background',
      hidden: ({parent}) => parent?.hoverBgColorRef !== 'custom',
    },
    {
      ...colorReferenceField,
      name: 'hoverTextColorRef',
      title: 'Hover Text Color',
    },
    {
      ...customColorField,
      name: 'hoverTextCustomColor',
      title: 'Custom Hover Text',
      hidden: ({parent}) => parent?.hoverTextColorRef !== 'custom',
    },
  ],
})
