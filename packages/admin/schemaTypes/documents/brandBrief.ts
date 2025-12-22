import {defineType} from 'sanity'

export default defineType({
  name: 'brandBrief',
  title: 'Brand Brief',
  type: 'document',
  groups: [
    {name: 'business', title: 'Business Info'},
    {name: 'audience', title: 'Target Audience'},
    {name: 'competitors', title: 'Competitors'},
    {name: 'content', title: 'Content Strategy'},
    {name: 'voice', title: 'Brand Voice'},
    {name: 'ai', title: 'AI Settings'},
  ],
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Brand Brief',
      hidden: true,
    },
    // Business Info
    {
      name: 'businessOverview',
      title: 'Business Overview',
      type: 'text',
      rows: 5,
      description: 'Provide a comprehensive overview of your business. What do you do? What problems do you solve? What makes your business unique?',
      placeholder: 'We help small businesses streamline their operations by providing an all-in-one platform for project management, team collaboration, and client communication. Founded in 2020, we\'ve helped over 1,000 teams work more efficiently...',
      group: 'business',
    },
    {
      name: 'industry',
      title: 'Industry',
      type: 'string',
      description: 'e.g., SaaS, Real Estate, Healthcare, E-commerce, Consulting',
      placeholder: 'Healthcare',
      group: 'business',
    },
    {
      name: 'businessModel',
      title: 'Business Model',
      type: 'string',
      options: {
        list: [
          {title: 'B2B (Business to Business)', value: 'b2b'},
          {title: 'B2C (Business to Consumer)', value: 'b2c'},
          {title: 'D2C (Direct to Consumer)', value: 'd2c'},
          {title: 'B2B2C', value: 'b2b2c'},
          {title: 'Marketplace', value: 'marketplace'},
        ],
      },
      group: 'business',
    },
    {
      name: 'productServices',
      title: 'Products/Services',
      type: 'text',
      rows: 3,
      description: 'What do you sell or offer? Be specific.',
      placeholder: 'We provide project management software for small teams...',
      group: 'business',
    },
    {
      name: 'uniqueSellingProposition',
      title: 'Unique Selling Proposition (USP)',
      type: 'text',
      rows: 3,
      description: 'What makes you different from competitors? Your key differentiator.',
      placeholder: 'Simplest setup in 5 minutes, no training required',
      group: 'business',
    },
    {
      name: 'companySize',
      title: 'Company Size',
      type: 'string',
      options: {
        list: [
          {title: 'Solo/Freelancer', value: 'solo'},
          {title: '2-10 employees', value: 'small'},
          {title: '11-50 employees', value: 'medium'},
          {title: '51-200 employees', value: 'large'},
          {title: '200+ employees', value: 'enterprise'},
        ],
      },
      group: 'business',
    },
    // Target Audience
    {
      name: 'targetAudience',
      title: 'Target Audience Description',
      type: 'text',
      rows: 4,
      description: 'Who are your ideal customers? Demographics, job titles, company size, etc.',
      placeholder: 'Small business owners, 30-50 years old, managing teams of 5-20 people...',
      group: 'audience',
    },
    {
      name: 'audiencePainPoints',
      title: 'Audience Pain Points',
      type: 'array',
      of: [{type: 'string'}],
      description: 'What problems does your audience face? What keeps them up at night?',
      group: 'audience',
    },
    {
      name: 'audienceGoals',
      title: 'Audience Goals',
      type: 'array',
      of: [{type: 'string'}],
      description: 'What are they trying to achieve? What success looks like for them?',
      group: 'audience',
    },
    {
      name: 'buyingBehavior',
      title: 'Buying Behavior',
      type: 'text',
      rows: 3,
      description: 'How does your audience research and make buying decisions?',
      placeholder: 'They Google for solutions, read reviews, compare pricing, need quick ROI proof...',
      group: 'audience',
    },
    // Competitors
    {
      name: 'competitors',
      title: 'Main Competitors',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Competitor Name',
              type: 'string',
            },
            {
              name: 'website',
              title: 'Website',
              type: 'url',
            },
            {
              name: 'strengths',
              title: 'Their Strengths',
              type: 'text',
              rows: 2,
              description: 'What do they do well?',
            },
            {
              name: 'weaknesses',
              title: 'Their Weaknesses',
              type: 'text',
              rows: 2,
              description: 'Where do they fall short?',
            },
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'website',
            },
          },
        },
      ],
      group: 'competitors',
    },
    // Content Strategy
    {
      name: 'seedKeywords',
      title: 'Seed Keywords',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Main keywords/phrases your audience searches for. These will guide topic generation.',
      group: 'content',
    },
    {
      name: 'topicClusters',
      title: 'Topic Clusters',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Main topic areas you want to cover (e.g., "Product Updates", "Industry Trends")',
      group: 'content',
    },
    {
      name: 'contentGoals',
      title: 'Content Goals',
      type: 'array',
      of: [
        {
          type: 'string',
          options: {
            list: [
              {title: 'Generate Leads', value: 'leads'},
              {title: 'Build Authority', value: 'authority'},
              {title: 'Educate Audience', value: 'educate'},
              {title: 'Drive Sales', value: 'sales'},
              {title: 'Support SEO Rankings', value: 'seo'},
              {title: 'Build Community', value: 'community'},
            ],
          },
        },
      ],
      group: 'content',
    },
    {
      name: 'contentFrequency',
      title: 'Desired Content Frequency',
      type: 'string',
      options: {
        list: [
          {title: 'Daily', value: 'daily'},
          {title: '2-3 times per week', value: 'frequent'},
          {title: 'Weekly', value: 'weekly'},
          {title: 'Bi-weekly', value: 'biweekly'},
          {title: 'Monthly', value: 'monthly'},
        ],
      },
      group: 'content',
    },
    // Brand Voice
    {
      name: 'toneOfVoice',
      title: 'Tone of Voice',
      type: 'array',
      of: [
        {
          type: 'string',
          options: {
            list: [
              {title: 'Professional', value: 'professional'},
              {title: 'Casual/Friendly', value: 'casual'},
              {title: 'Authoritative', value: 'authoritative'},
              {title: 'Playful', value: 'playful'},
              {title: 'Technical', value: 'technical'},
              {title: 'Conversational', value: 'conversational'},
              {title: 'Inspirational', value: 'inspirational'},
              {title: 'Educational', value: 'educational'},
            ],
          },
        },
      ],
      description: 'Select all that apply',
      group: 'voice',
    },
    {
      name: 'writingStyle',
      title: 'Writing Style Preferences',
      type: 'text',
      rows: 3,
      description: 'Any specific writing preferences? (e.g., short paragraphs, use of emojis, etc.)',
      placeholder: 'Keep paragraphs short, use bullet points, avoid jargon...',
      group: 'voice',
    },
    {
      name: 'avoidWords',
      title: 'Words/Phrases to Avoid',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Overused or inappropriate words for your brand',
      group: 'voice',
    },
    {
      name: 'preferredWords',
      title: 'Preferred Words/Phrases',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Words that resonate with your brand voice',
      group: 'voice',
    },
    // AI Settings
    {
      name: 'aiImageGeneration',
      title: 'Enable AI Image Generation',
      type: 'boolean',
      description: 'Automatically generate featured images for blog posts',
      initialValue: true,
      group: 'ai',
    },
    {
      name: 'aiImageStyle',
      title: 'AI Image Style',
      type: 'string',
      options: {
        list: [
          {title: 'Photographic (Realistic)', value: 'photographic'},
          {title: 'Digital Art (Modern)', value: 'digital-art'},
          {title: 'Illustration (Professional)', value: 'illustration'},
          {title: 'Minimalist (Clean & Simple)', value: 'minimalist'},
          {title: 'Abstract (Artistic)', value: 'abstract'},
          {title: 'Natural (Default)', value: 'natural'},
        ],
      },
      initialValue: 'photographic',
      description: 'Visual style for auto-generated blog images',
      group: 'ai',
      hidden: ({parent}) => !parent?.aiImageGeneration,
    },
    {
      name: 'aiImageQuality',
      title: 'AI Image Quality',
      type: 'string',
      options: {
        list: [
          {title: 'Standard (Faster, lower cost)', value: 'standard'},
          {title: 'HD (Higher quality, slower)', value: 'hd'},
        ],
      },
      initialValue: 'standard',
      description: 'Quality level for generated images',
      group: 'ai',
      hidden: ({parent}) => !parent?.aiImageGeneration,
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Brand Brief',
        subtitle: 'Your brand & content strategy guide',
      }
    },
  },
})
