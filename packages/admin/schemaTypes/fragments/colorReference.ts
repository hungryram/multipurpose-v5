// Reusable color reference field for referencing appearance colors
export const colorReferenceField = {
  name: 'colorReference',
  title: 'Color',
  type: 'string',
  description: 'Select a brand color or use custom',
  options: {
    list: [
      {title: 'Primary Color', value: 'primary'},
      {title: 'Secondary Color', value: 'secondary'},
      {title: 'Accent Color', value: 'accent'},
      {title: 'Neutral Color', value: 'neutral'},
      {title: 'Text Color', value: 'text'},
      {title: 'Heading Color', value: 'heading'},
      {title: 'Button Background', value: 'buttonBg'},
      {title: 'Button Text', value: 'buttonText'},
      {title: 'Custom Color', value: 'custom'},
    ],
  },
  initialValue: 'primary',
}

export const customColorField = {
  name: 'customColor',
  title: 'Custom Color',
  type: 'color',
  description: 'Only used when "Custom Color" is selected above',
  hidden: ({parent}: any) => parent?.colorReference !== 'custom',
}
