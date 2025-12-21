import {defineType} from 'sanity'
import {sectionSettingsFields} from '../fragments/sectionSettings'
import {blockContent} from '../fragments/blockContent'

export default defineType({
  name: 'contactForm',
  title: 'Contact Form',
  type: 'object',
  groups: [
    {name: 'content', title: 'Content'},
    {name: 'fields', title: 'Form Fields'},
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

      name: 'formFields',
      title: 'Form Fields',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'fieldType',
              title: 'Field Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Text Input', value: 'text'},
                  {title: 'Email', value: 'email'},
                  {title: 'Phone', value: 'tel'},
                  {title: 'Textarea', value: 'textarea'},
                  {title: 'Select Dropdown', value: 'select'},
                  {title: 'Checkbox', value: 'checkbox'},
                ],
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'placeholder',
              title: 'Placeholder',
              type: 'string',
            },
            {
              name: 'required',
              title: 'Required Field',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'options',
              title: 'Options (for select)',
              type: 'array',
              of: [{type: 'string'}],
              hidden: ({parent}) => parent?.fieldType !== 'select',
            },
            {
              name: 'halfWidth',
              title: 'Half Width (2 columns)',
              type: 'boolean',
              initialValue: false,
            },
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'fieldType',
              required: 'required',
            },
            prepare({title, subtitle, required}) {
              return {
                title: `${title}${required ? ' *' : ''}`,
                subtitle,
              }
            },
          },
        },
      ],
      group: 'fields',
    },
    {
      name: 'submitButtonText',
      title: 'Submit Button Text',
      type: 'string',
      initialValue: 'Send Message',
      group: 'settings',
    },
    {
      name: 'successMessage',
      title: 'Success Message',
      type: 'text',
      rows: 2,
      initialValue: 'Thank you for your message! We will get back to you soon.',
      group: 'settings',
    },
    {
      name: 'redirectAfterSubmit',
      title: 'Redirect After Submit',
      type: 'boolean',
      initialValue: false,
      description: 'Redirect user to another page after successful submission',
      group: 'settings',
    },
    {
      name: 'redirectPage',
      title: 'Redirect To',
      type: 'object',
      description: 'Select a page to redirect to after form submission',
      hidden: ({parent}) => !parent?.redirectAfterSubmit,
      group: 'settings',
      fields: [
        {
          name: 'linkType',
          title: 'Link Type',
          type: 'string',
          options: {
            list: [
              {title: 'Internal Page', value: 'internal'},
              {title: 'External URL', value: 'external'},
              {title: 'Path', value: 'path'},
            ],
          },
          initialValue: 'internal',
        },
        {
          name: 'internalLink',
          title: 'Select Page',
          type: 'reference',
          to: [{type: 'home'}, {type: 'blogIndex'}, {type: 'page'}],
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
      ],
    },
    {
      name: 'notificationEmail',
      title: 'Notification Email',
      type: 'string',
      description: 'Email address to receive form submissions',
      group: 'settings',
    },
    {
      name: 'googleSheetId',
      title: 'Google Sheet ID',
      type: 'string',
      description: 'Copy from sheet URL: https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit',
      group: 'settings',
    },
    {
      name: 'googleSheetTabName',
      title: 'Google Sheet Tab Name',
      type: 'string',
      description: 'Name of the tab/sheet to save data to (e.g., Sheet1, Contact Form)',
      placeholder: 'Sheet1',
      group: 'settings',
    },
    {
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Full Width', value: 'full'},
          {title: 'Centered', value: 'centered'},
          {title: 'Split (Form + Content)', value: 'split'},
        ],
      },
      initialValue: 'centered',
      group: 'settings',
    },
    {
      name: 'sideContent',
      title: 'Side Content',
      type: 'array',
      of: [{type: 'block'}],
      group: 'content',
      hidden: ({parent}) => parent?.layout !== 'split',
    },
    ...sectionSettingsFields,
  ],
  preview: {
    select: {
      content: 'content',
      fields: 'formFields',
    },
    prepare({content, fields}) {
      const block = (content || []).find((block: any) => block._type === 'block')
      const title = block?.children?.[0]?.text
      return {
        title: title || 'Contact Form',
        subtitle: `${fields?.length || 0} fields`,
      }
    },
  },
})
