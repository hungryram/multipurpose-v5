import {createClient} from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'v5zn3nrf',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-12-18',
  useCdn: true, // Use CDN for faster responses
  perspective: 'published',
  stega: false,
})

// Write client for API routes (with token)
export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'v5zn3nrf',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-12-18',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  perspective: 'published',
  stega: false,
})
