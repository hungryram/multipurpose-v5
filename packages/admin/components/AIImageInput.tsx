import {ImageInput} from 'sanity'
import {Stack} from '@sanity/ui'
import {ImageGenerator} from './ImageGenerator'

export function AIImageInput(props: any) {
  return (
    <Stack space={3}>
      {/* AI Image Generator */}
      <ImageGenerator
        value={props.value}
        onChange={props.onChange}
        schemaType={props.schemaType}
      />
      
      {/* Standard Image Input */}
      <ImageInput {...props} />
    </Stack>
  )
}
