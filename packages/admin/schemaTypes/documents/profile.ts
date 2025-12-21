import {defineType} from 'sanity'

export default defineType({
  name: 'profile',
  title: 'Profile',
  type: 'document',
  groups: [
    {
      name: 'company',
      title: 'Company',
    },
    {
      name: 'contact',
      title: 'Contact',
    },
    {
      name: 'social',
      title: 'Social Media',
    },
    {
      name: 'settings',
      title: 'Settings',
    },
  ],
  fields: [
    {
      name: 'company_name',
      title: 'Company Name',
      type: 'string',
      group: 'company',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'contact_information',
      title: 'Contact Information',
      type: 'object',
      group: 'contact',
      fields: [
        {
          name: 'email',
          title: 'Email',
          type: 'string',
        },
        {
          name: 'phone',
          title: 'Phone',
          type: 'string',
        },
      ],
    },
    {
      name: 'address',
      title: 'Address',
      type: 'object',
      group: 'contact',
      fields: [
        {
          name: 'street',
          title: 'Street Address',
          type: 'string',
        },
        {
          name: 'city',
          title: 'City',
          type: 'string',
        },
        {
          name: 'state',
          title: 'State',
          type: 'string',
        },
        {
          name: 'zip',
          title: 'ZIP Code',
          type: 'string',
        },
      ],
    },
    {
      name: 'social',
      title: 'Social Media',
      type: 'object',
      group: 'social',
      fields: [
        {name: 'facebook', title: 'Facebook', type: 'url'},
        {name: 'twitter', title: 'Twitter/X', type: 'url'},
        {name: 'instagram', title: 'Instagram', type: 'url'},
        {name: 'linkedin', title: 'LinkedIn', type: 'url'},
        {name: 'youtube', title: 'YouTube', type: 'url'},
      ],
    },
    {
      name: 'settings',
      title: 'Settings',
      type: 'object',
      group: 'settings',
      fields: [
        {
          name: 'websiteName',
          title: 'Website URL',
          type: 'url',
        },
        {
          name: 'googleID',
          title: 'Google Analytics 4 Measurement ID',
          type: 'string',
          description: 'Enter your GA4 Measurement ID (format: G-XXXXXXXXXX)',
          placeholder: 'G-XXXXXXXXXX',
        },
        {
          name: 'facebookPixel',
          title: 'Facebook Pixel ID',
          type: 'string',
          description: 'Enter your Facebook Pixel ID',
          placeholder: '1234567890123456',
        },
        {
          name: 'googleSearchConsole',
          title: 'Google Search Console Verification',
          type: 'string',
          description: 'Enter your Google Search Console verification code (the content value from the meta tag)',
          placeholder: 'abcd1234efgh5678...',
        },
        {
          name: 'enableAIFeatures',
          title: 'Enable AI SEO Tools',
          type: 'boolean',
          description: 'Enable AI-powered features like smart alt text generation and SEO meta suggestions (requires OpenAI API key in environment)',
          initialValue: false,
        },
        {
          name: 'aiContentAutomation',
          title: 'AI Content Automation',
          type: 'object',
          description: 'Configure automated blog post generation using AI',
          fields: [
            {
              name: 'enabled',
              title: 'Enable Auto-Generation',
              type: 'boolean',
              description: 'Automatically generate blog posts on a schedule',
              initialValue: false,
            },
            {
              name: 'frequency',
              title: 'Publishing Frequency',
              type: 'string',
              description: 'How often to generate new blog posts',
              options: {
                list: [
                  {title: '1x per week (Monday)', value: '1x'},
                  {title: '2x per week (Monday, Thursday)', value: '2x'},
                  {title: '3x per week (Monday, Wednesday, Friday)', value: '3x'},
                  {title: 'Daily (Monday-Friday)', value: 'daily'},
                ],
              },
              initialValue: '3x',
              hidden: ({parent}) => !parent?.enabled,
            },
            {
              name: 'publishTime',
              title: 'Publish Time (UTC)',
              type: 'string',
              description: 'What time to generate posts (in UTC timezone)',
              options: {
                list: [
                  {title: '6:00 AM UTC (1 AM EST)', value: '6'},
                  {title: '9:00 AM UTC (4 AM EST)', value: '9'},
                  {title: '12:00 PM UTC (7 AM EST)', value: '12'},
                  {title: '3:00 PM UTC (10 AM EST)', value: '15'},
                ],
              },
              initialValue: '9',
              hidden: ({parent}) => !parent?.enabled,
            },
            {
              name: 'contentStyle',
              title: 'Content Style',
              type: 'string',
              description: 'Writing tone and style for generated content',
              options: {
                list: [
                  {title: 'Professional', value: 'professional'},
                  {title: 'Conversational', value: 'conversational'},
                  {title: 'Technical', value: 'technical'},
                  {title: 'Casual', value: 'casual'},
                ],
              },
              initialValue: 'professional',
              hidden: ({parent}) => !parent?.enabled,
            },
            {
              name: 'wordCount',
              title: 'Target Word Count',
              type: 'string',
              description: 'Approximate length of generated articles',
              options: {
                list: [
                  {title: '800-1200 words (Quick read)', value: 'short'},
                  {title: '1200-1800 words (Standard)', value: 'medium'},
                  {title: '1800-2500 words (In-depth)', value: 'long'},
                ],
              },
              initialValue: 'medium',
              hidden: ({parent}) => !parent?.enabled,
            },
            {
              name: 'autoPublish',
              title: 'Auto-Publish Posts',
              type: 'boolean',
              description: 'Automatically publish generated posts (⚠️ if disabled, posts will be saved as drafts for review)',
              initialValue: false,
              hidden: ({parent}) => !parent?.enabled,
            },
            {
              name: 'generateImages',
              title: 'Generate Featured Images',
              type: 'boolean',
              description: 'Use AI to generate featured images for posts (adds ~$0.04 per image)',
              initialValue: true,
              hidden: ({parent}) => !parent?.enabled,
            },
            {
              name: 'focusTopics',
              title: 'Focus Topics',
              type: 'array',
              of: [{type: 'string'}],
              description: 'Optional: Keywords or themes to focus on (e.g., "customer service", "industry trends")',
              hidden: ({parent}) => !parent?.enabled,
            },
            {
              name: 'excludeTopics',
              title: 'Exclude Topics',
              type: 'array',
              of: [{type: 'string'}],
              description: 'Optional: Topics to avoid (e.g., "politics", "religion")',
              hidden: ({parent}) => !parent?.enabled,
            },
            {
              name: 'notificationEmail',
              title: 'Notification Email',
              type: 'string',
              description: 'Email address to notify when posts are generated (uses contact email if empty)',
              hidden: ({parent}) => !parent?.enabled,
            },
          ],
        },
      ],
    },
  ],
})
