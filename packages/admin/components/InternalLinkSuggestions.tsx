import {Card, Stack, Text, Flex, Box} from '@sanity/ui'
import {useEffect, useState} from 'react'
import {useClient, useFormValue} from 'sanity'

interface RelatedContent {
  _id: string
  _type: string
  title: string
  slug: string
}

export function InternalLinkSuggestions() {
  const client = useClient({apiVersion: '2024-12-18'})
  const document = useFormValue([]) as any
  const [suggestions, setSuggestions] = useState<RelatedContent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!document?._type) return

    const fetchSuggestions = async () => {
      try {
        let query = ''
        
        if (document?._type === 'post') {
          // For blog posts, prioritize same category and shared tags
          const categoryRef = document?.categories?.[0]?._ref || document?.category?._ref
          const tagRefs = document?.tags?.map((t: any) => t._ref).filter(Boolean) || []
          
          query = `{
            "relatedPosts": *[
              _type == "post" 
              && _id != $currentId 
              && !seo.noindex
              && (
                $categoryRef in categories[]._ref
                || count((tags[]._ref)[@ in $tagRefs]) > 0
              )
            ] | order(
              select(
                $categoryRef in categories[]._ref => 3,
                count((tags[]._ref)[@ in $tagRefs]) > 1 => 2,
                count((tags[]._ref)[@ in $tagRefs]) > 0 => 1,
                0
              ) desc,
              publishedAt desc
            ) [0...6] {
              _id,
              _type,
              title,
              "slug": slug.current,
              "matchType": select(
                $categoryRef in categories[]._ref => "Same category",
                count((tags[]._ref)[@ in $tagRefs]) > 0 => "Shared tags",
                "Recent"
              )
            },
            "otherPosts": *[
              _type == "post" 
              && _id != $currentId 
              && !seo.noindex
              && !($categoryRef in categories[]._ref)
              && count((tags[]._ref)[@ in $tagRefs]) == 0
            ] | order(publishedAt desc) [0...3] {
              _id,
              _type,
              title,
              "slug": slug.current,
              "matchType": "Recent"
            },
            "pages": *[_type == "page" && !seo.noindex] | order(title asc) [0...2] {
              _id,
              _type,
              title,
              "slug": slug.current
            }
          }`
        } else if (document?._type === 'page') {
          // For pages, suggest blog posts and other pages
          query = `{
            "posts": *[_type == "post" && !seo.noindex] | order(publishedAt desc) [0...5] {
              _id,
              _type,
              title,
              "slug": slug.current
            },
            "pages": *[_type == "page" && _id != $currentId && !seo.noindex] | order(title asc) [0...3] {
              _id,
              _type,
              title,
              "slug": slug.current
            },
            "services": *[_type == "service" && !seo.noindex] | order(title asc) [0...3] {
              _id,
              _type,
              title,
              "slug": slug.current
            }
          }`
        } else if (document?._type === 'service') {
          query = `{
            "services": *[_type == "service" && _id != $currentId && !seo.noindex] | order(title asc) [0...5] {
              _id,
              _type,
              title,
              "slug": slug.current
            },
            "posts": *[_type == "post" && !seo.noindex] | order(publishedAt desc) [0...3] {
              _id,
              _type,
              title,
              "slug": slug.current
            },
            "pages": *[_type == "page" && !seo.noindex] | order(title asc) [0...3] {
              _id,
              _type,
              title,
              "slug": slug.current
            }
          }`
        }

        const categoryRef = document?.categories?.[0]?._ref || document?.category?._ref || null
        const tagRefs = document?.tags?.map((t: any) => t._ref).filter(Boolean) || []

        const result = await client.fetch(query, {
          currentId: document?._id || 'new',
          categoryRef,
          tagRefs,
        })
        
        // Flatten results with priority order
        const allSuggestions: RelatedContent[] = []
        if (result.relatedPosts) allSuggestions.push(...result.relatedPosts)
        if (result.otherPosts) allSuggestions.push(...result.otherPosts)
        if (result.posts) allSuggestions.push(...result.posts)
        if (result.pages) allSuggestions.push(...result.pages)
        if (result.services) allSuggestions.push(...result.services)

        setSuggestions(allSuggestions)
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestions()
  }, [document?._type, document?.category, document?.tags, document?._id, client])

  const getPath = (item: RelatedContent) => {
    if (item._type === 'post') return `/blog/${item.slug}`
    if (item._type === 'service') return `/services/${item.slug}`
    if (item._type === 'page') return `/${item.slug}`
    return `/${item.slug}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (loading) {
    return (
      <Card padding={4} tone="transparent">
        <Text size={1} muted>Loading suggestions...</Text>
      </Card>
    )
  }

  if (suggestions.length === 0) {
    return (
      <Card padding={4} tone="transparent">
        <Text size={1} muted>No related content found</Text>
      </Card>
    )
  }

  return (
    <Card padding={4} tone="transparent" border>
      <Stack space={4}>
        <Flex align="center" gap={2}>
          <Text size={2} weight="semibold">🔗 Internal Link Suggestions</Text>
        </Flex>
        <Text size={1} muted>
          Click to copy the path, then add it as an internal link in your content
        </Text>
        <Stack space={3}>
          {suggestions.map((item) => {
            const path = getPath(item)
            return (
              <Card
                key={item._id}
                padding={3}
                radius={2}
                tone="default"
                style={{cursor: 'pointer'}}
                onClick={() => copyToClipboard(path)}
              >
                <Flex justify="space-between" align="center">
                  <Box flex={1}>
                    <Flex align="center" gap={2}>
                      <Text size={1} weight="medium">{item.title}</Text>
                      {(item as any).matchType && (item as any).matchType !== 'Recent' && (
                        <Text size={1} style={{
                          color: (item as any).matchType === 'Same category' ? '#10b981' : '#f59e0b',
                          fontSize: '11px'
                        }}>
                          {(item as any).matchType === 'Same category' ? '🎯' : '🏷️'} {(item as any).matchType}
                        </Text>
                      )}
                    </Flex>
                    <Text size={1} muted style={{marginTop: 4}}>
                      {path}
                    </Text>
                  </Box>
                  <Text size={1} muted>
                    {item._type === 'post' ? '📝' : item._type === 'service' ? '⚙️' : '📄'}
                  </Text>
                </Flex>
              </Card>
            )
          })}
        </Stack>
        <Text size={1} muted style={{fontStyle: 'italic'}}>
          💡 Tip: Add 3-5 internal links per post to improve SEO and user navigation
        </Text>
      </Stack>
    </Card>
  )
}
