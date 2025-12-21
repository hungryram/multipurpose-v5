import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {colorInput} from '@sanity/color-input'
import {media} from 'sanity-plugin-media'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'multipurpose-v5',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Site Settings
            S.listItem()
              .title('Profile')
              .child(S.document().schemaType('profile').documentId('profile')),
            S.listItem()
              .title('Appearance')
              .child(S.document().schemaType('appearance').documentId('appearance')),
            S.listItem()
              .title('Brand Brief')
              .child(S.document().schemaType('brandBrief').documentId('brandBrief')),
            S.divider(),
            
            // Page Indexes
            S.listItem()
              .title('Blog Index')
              .child(S.document().schemaType('blogIndex').documentId('blogIndex')),
            S.listItem()
              .title('Services Index')
              .child(S.document().schemaType('servicesIndex').documentId('servicesIndex')),
            S.divider(),
            
            // SEO & Redirects
            S.listItem()
              .title('Redirects')
              .child(S.documentTypeList('redirect').title('Redirects')),
            S.divider(),
            
            // Content
            ...S.documentTypeListItems().filter(
              (listItem) => !['profile', 'appearance', 'brandBrief', 'blogIndex', 'servicesIndex', 'redirect', 'media.tag'].includes(listItem.getId()!)
            ),
          ]),
    }),
    visionTool(),
    colorInput(),
    media(),
  ],

  schema: {
    types: schemaTypes,
  },
})
