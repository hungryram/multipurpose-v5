import {Stack, Text, TextInput} from '@sanity/ui'
import {set, unset} from 'sanity'
import {StringInputProps} from 'sanity'

export function SeoTitleInput(props: StringInputProps) {
  const {value, onChange} = props
  const length = value?.length || 0

  // Optimal range: 50-60 characters for Google search results
  const getColor = () => {
    if (length === 0) return '#6b7280' // gray
    if (length < 50) return '#f59e0b' // yellow - too short
    if (length <= 60) return '#10b981' // green - optimal
    return '#f03e2f' // red - too long
  }

  const getMessage = () => {
    if (length === 0) return 'Add a meta title for search results'
    if (length < 50) return `Add ${50 - length} more characters for optimal length`
    if (length <= 60) return 'Perfect length for Google search results'
    return `${length - 60} characters over the recommended limit`
  }

  return (
    <Stack space={2}>
      <TextInput
        {...props}
        onChange={(event) =>
          onChange(
            event.currentTarget.value ? set(event.currentTarget.value) : unset()
          )
        }
        value={value || ''}
      />
      <Stack space={2}>
        <Text size={1} style={{color: getColor()}}>
          {length} characters
        </Text>
        <Text size={1} muted>
          {getMessage()}
        </Text>
      </Stack>
    </Stack>
  )
}
