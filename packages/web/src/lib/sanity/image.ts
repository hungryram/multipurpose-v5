import {createImageUrlBuilder, type SanityImageSource} from '@sanity/image-url'
import {client} from './client'

const builder = createImageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

export function getImageDimensions(image: any) {
  if (!image?.asset?._ref) return null
  
  const dimensions = image.asset._ref.split('-')[2]
  const [width, height] = dimensions.split('x').map(Number)
  
  return {width, height, aspectRatio: width / height}
}
