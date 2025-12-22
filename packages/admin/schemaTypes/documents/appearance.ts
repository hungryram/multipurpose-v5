import {defineType} from 'sanity'
import {AltTextGenerator} from '../../components/AltTextGenerator'
import {blockContent} from '../fragments/blockContent'

export default defineType({
  name: 'appearance',
  title: 'Appearance',
  type: 'document',
  groups: [
    {
      name: 'general',
      title: 'General',
    },
    {
      name: 'branding',
      title: 'Branding',
    },
    {
      name: 'colors',
      title: 'Colors',
    },
    {
      name: 'header',
      title: 'Header',
    },
    {
      name: 'footer',
      title: 'Footer',
    },
  ],
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Site Appearance',
      hidden: true,
    },
    {
      name: 'homePage',
      title: 'Active Home Page',
      type: 'reference',
      to: [{type: 'home'}],
      group: 'general',
      description: 'Select which home page document to display on the homepage',
    },
    {
      name: 'branding',
      title: 'Branding',
      type: 'object',
      group: 'branding',
      fields: [
        {
          name: 'favicon',
          title: 'Favicon',
          type: 'image',
          description: 'Site favicon (recommended: 32x32 PNG or ICO)',
          options: {
            accept: 'image/png,image/x-icon,image/svg+xml',
          },
          fields: [
            {
              name: 'altText',
              title: 'Alt Text',
              type: 'string',
            },
          ],
        },
        {
          name: 'logo',
          title: 'Logo',
          type: 'image',
          fields: [
            {
              name: 'altText',
              title: 'Alt Text',
              type: 'string',
              description: 'Describes your logo for accessibility and SEO',
              components: {
                input: AltTextGenerator,
              },
            },
          ],
        },
        {
          name: 'logoScroll',
          title: 'Logo on Scroll',
          type: 'image',
          description: 'Optional different logo when page is scrolled',
          fields: [
            {
              name: 'altText',
              title: 'Alt Text',
              type: 'string',
              components: {
                input: AltTextGenerator,
              },
            },
          ],
        },
        {
          name: 'logoWidth',
          title: 'Logo Width (px)',
          type: 'number',
          initialValue: 150,
        },
      ],
    },
    {
      name: 'mainColors',
      title: 'Main Colors',
      type: 'object',
      group: 'colors',
      fields: [
        {name: 'primaryColor', title: 'Primary Color', type: 'color'},
        {name: 'secondaryColor', title: 'Secondary Color', type: 'color'},
        {name: 'accentColor', title: 'Accent Color', type: 'color'},
        {name: 'neutralColor', title: 'Neutral Color', type: 'color'},
        {name: 'websiteTextColor', title: 'Text Color', type: 'color'},
        {name: 'websiteHeadingColor', title: 'Heading Color', type: 'color'},
        {name: 'buttonBackgroundColor', title: 'Button Background', type: 'color'},
        {name: 'buttonTextColor', title: 'Button Text', type: 'color'},
        {name: 'websiteBgColor', title: 'Website Background', type: 'color'},
      ],
    },
    {
      name: 'header',
      title: 'Header Settings',
      type: 'object',
      group: 'header',
      fields: [
        {name: 'navColor', title: 'Nav Text Color', type: 'color'},
        {name: 'headerColor', title: 'Header Background', type: 'color'},
        {name: 'navScrollColor', title: 'Nav Text Color (Scrolled)', type: 'color'},
        {name: 'headerColorScroll', title: 'Header Background (Scrolled)', type: 'color'},
        {
          name: 'mainNav',
          title: 'Main Navigation',
          type: 'reference',
          to: [{type: 'navigation'}],
        },
      ],
    },
    {
      name: 'footer',
      title: 'Footer Settings',
      type: 'object',
      group: 'footer',
      fields: [
        {
          name: 'footerText',
          title: 'Footer Text',
          type: 'array',
          of: [blockContent],
        },
        {name: 'footerBackgroundColor', title: 'Background Color', type: 'color'},
        {name: 'textColor', title: 'Text Color', type: 'color'},
      ],
    },
  ],
})
