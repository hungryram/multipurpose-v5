// Reusable section settings fields for all page builder blocks
import {colorReferenceField, customColorField} from './colorReference'

export const sectionSettingsFields = [
  {
    name: 'primaryButton',
    title: 'Primary Button',
    type: 'button',
    group: 'settings',
  },
  {
    name: 'secondaryButton',
    title: 'Secondary Button',
    type: 'button',
    group: 'settings',
  },
  {
    name: 'paddingTop',
    title: 'Padding Top',
    type: 'string',
    options: {
      list: [
        {title: 'None (0)', value: 'none'},
        {title: 'Small (2rem/3rem)', value: 'small'},
        {title: 'Medium (4rem/6rem)', value: 'medium'},
        {title: 'Large (6rem/8rem)', value: 'large'},
        {title: 'Extra Large (8rem/12rem)', value: 'xlarge'},
        {title: 'Custom', value: 'custom'},
      ],
    },
    initialValue: 'medium',
    group: 'settings',
  },
  {
    name: 'paddingTopCustom',
    title: 'Custom Padding Top',
    type: 'string',
    description: 'Enter padding with unit (e.g., "80px", "5rem", "10%")',
    hidden: ({parent}: any) => parent?.paddingTop !== 'custom',
    validation: (Rule: any) =>
      Rule.custom((value: string | undefined) => {
        if (!value) return true
        // Allow px, rem, em, %, vh, vw units
        if (!/^\d+(\.\d+)?(px|rem|em|%|vh|vw)$/.test(value)) {
          return 'Please enter a valid CSS value (e.g., "80px", "5rem", "10%")'
        }
        return true
      }),
    group: 'settings',
  },
  {
    name: 'paddingBottom',
    title: 'Padding Bottom',
    type: 'string',
    options: {
      list: [
        {title: 'None (0)', value: 'none'},
        {title: 'Small (2rem/3rem)', value: 'small'},
        {title: 'Medium (4rem/6rem)', value: 'medium'},
        {title: 'Large (6rem/8rem)', value: 'large'},
        {title: 'Extra Large (8rem/12rem)', value: 'xlarge'},
        {title: 'Custom', value: 'custom'},
      ],
    },
    initialValue: 'medium',
    group: 'settings',
  },
  {
    name: 'paddingBottomCustom',
    title: 'Custom Padding Bottom',
    type: 'string',
    description: 'Enter padding with unit (e.g., "80px", "5rem", "10%")',
    hidden: ({parent}: any) => parent?.paddingBottom !== 'custom',
    validation: (Rule: any) =>
      Rule.custom((value: string | undefined) => {
        if (!value) return true
        // Allow px, rem, em, %, vh, vw units
        if (!/^\d+(\.\d+)?(px|rem|em|%|vh|vw)$/.test(value)) {
          return 'Please enter a valid CSS value (e.g., "80px", "5rem", "10%")'
        }
        return true
      }),
    group: 'settings',
  },
  {
    name: 'containerWidth',
    title: 'Container Width',
    type: 'string',
    options: {
      list: [
        {title: 'Narrow (1024px)', value: 'narrow'},
        {title: 'Default (1280px)', value: 'default'},
        {title: 'Wide (1536px)', value: 'wide'},
        {title: 'Full Width', value: 'full'},
      ],
    },
    initialValue: 'default',
    group: 'settings',
  },
  {
    name: 'anchorId',
    title: 'Anchor ID',
    type: 'string',
    description: 'Optional ID for linking to this section (e.g., "pricing" for #pricing)',
    validation: (Rule: any) =>
      Rule.custom((value: string | undefined) => {
        if (!value) return true
        if (!/^[a-z0-9-]+$/.test(value)) {
          return 'Anchor ID must contain only lowercase letters, numbers, and hyphens'
        }
        return true
      }),
    group: 'settings',
  },
  {
    name: 'backgroundType',
    title: 'Background Type',
    type: 'string',
    options: {
      list: [
        {title: 'None', value: 'none'},
        {title: 'Solid Color', value: 'color'},
        {title: 'Gradient', value: 'gradient'},
        {title: 'Image', value: 'image'},
      ],
    },
    initialValue: 'none',
    group: 'settings',
  },
  {
    ...colorReferenceField,
    name: 'backgroundColorRef',
    title: 'Background Color',
    hidden: ({parent}: any) => parent?.backgroundType !== 'color',
    group: 'settings',
  },
  {
    ...customColorField,
    name: 'backgroundCustomColor',
    title: 'Custom Background Color',
    hidden: ({parent}: any) => parent?.backgroundType !== 'color' || parent?.backgroundColorRef !== 'custom',
    group: 'settings',
  },
  {
    name: 'backgroundGradient',
    title: 'Background Gradient',
    type: 'object',
    hidden: ({parent}: any) => parent?.backgroundType !== 'gradient',
    fields: [
      {
        ...colorReferenceField,
        name: 'fromRef',
        title: 'From Color',
      },
      {
        ...customColorField,
        name: 'fromCustom',
        title: 'Custom From Color',
        hidden: ({parent}: any) => parent?.fromRef !== 'custom',
      },
      {
        ...colorReferenceField,
        name: 'toRef',
        title: 'To Color',
      },
      {
        ...customColorField,
        name: 'toCustom',
        title: 'Custom To Color',
        hidden: ({parent}: any) => parent?.toRef !== 'custom',
      },
      {
        name: 'direction',
        title: 'Direction',
        type: 'string',
        options: {
          list: [
            {title: 'Left to Right', value: 'to-r'},
            {title: 'Top to Bottom', value: 'to-b'},
            {title: 'Diagonal (Top-Left to Bottom-Right)', value: 'to-br'},
            {title: 'Diagonal (Top-Right to Bottom-Left)', value: 'to-bl'},
            {title: 'Right to Left', value: 'to-l'},
          ],
        },
        initialValue: 'to-r',
      },
    ],
    group: 'settings',
  },
  {
    name: 'backgroundImage',
    title: 'Background Image',
    type: 'object',
    hidden: ({parent}: any) => parent?.backgroundType !== 'image',
    fields: [
      {
        name: 'image',
        title: 'Image',
        type: 'image',
        options: {
          hotspot: true,
        },
      },
      {
        name: 'priority',
        title: 'Priority Loading',
        type: 'boolean',
        description: 'Enable for above-the-fold images (first section). Improves LCP score.',
        initialValue: false,
      },
      {
        ...colorReferenceField,
        name: 'overlayColorRef',
        title: 'Overlay Color',
        description: 'Optional color overlay on the image',
      },
      {
        ...customColorField,
        name: 'overlayCustomColor',
        title: 'Custom Overlay Color',
        hidden: ({parent}: any) => parent?.overlayColorRef !== 'custom',
      },
      {
        name: 'overlayOpacity',
        title: 'Overlay Opacity',
        type: 'number',
        description: 'Opacity of the overlay (0-100)',
        validation: (Rule: any) => Rule.min(0).max(100),
        initialValue: 50,
      },
    ],
    group: 'settings',
  },
  {
    ...colorReferenceField,
    name: 'textColorRef',
    title: 'Text Color',
    description: 'Override text color for this section',
    group: 'settings',
  },
  {
    ...customColorField,
    name: 'textCustomColor',
    title: 'Custom Text Color',
    hidden: ({parent}: any) => parent?.textColorRef !== 'custom',
    group: 'settings',
  },
  {
    name: 'textAlign',
    title: 'Text Alignment',
    type: 'string',
    options: {
      list: [
        {title: 'Left', value: 'left'},
        {title: 'Center', value: 'center'},
        {title: 'Right', value: 'right'},
      ],
    },
    initialValue: 'center',
    group: 'settings',
  },
]
