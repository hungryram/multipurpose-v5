export interface TocItem {
  id: string
  text: string
  level: number
}

/**
 * Slugify text for URL-friendly anchor IDs
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Extract headings from portable text body for table of contents
 */
export function extractHeadings(body: any[]): TocItem[] {
  if (!body || !Array.isArray(body)) return []

  const headings: TocItem[] = []
  const seenIds = new Set<string>()

  body.forEach((block) => {
    if (block._type === 'block' && block.style === 'h2') {
      const text = block.children
        ?.filter((child: any) => child._type === 'span')
        .map((child: any) => child.text)
        .join('')

      if (text) {
        let id = slugify(text)
        
        // Handle duplicate IDs
        let counter = 1
        let uniqueId = id
        while (seenIds.has(uniqueId)) {
          uniqueId = `${id}-${counter}`
          counter++
        }
        seenIds.add(uniqueId)

        headings.push({
          id: uniqueId,
          text,
          level: 2,
        })
      }
    }
  })

  return headings
}
