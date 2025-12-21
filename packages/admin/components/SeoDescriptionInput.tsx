import {Stack, Text, TextArea} from '@sanity/ui'
import {set, unset} from 'sanity'
import {TextInputProps} from 'sanity'

export function SeoDescriptionInput(props: TextInputProps) {
  const {value, onChange} = props
  const length = value?.length || 0

  // Optimal range: 70-155 characters for Google search results
  const getColor = () => {
    if (length === 0) return '#6b7280' // gray
    if (length < 70) return '#f59e0b' // yellow - too short
    if (length <= 155) return '#10b981' // green - optimal
    return '#f03e2f' // red - too long
  }

  const getMessage = () => {
    if (length === 0) return 'Add a meta description for search results'
    if (length < 70) return `Add ${70 - length} more characters for optimal length`
    if (length <= 155) return 'Perfect length for Google search results'
    return `${length - 155} characters over the recommended limit`
  }

  return (
    <Stack space={2}>
      <TextArea
        {...props}
        onChange={(event) =>
          onChange(
            event.currentTarget.value ? set(event.currentTarget.value) : unset()
          )
        }
        value={value || ''}
        rows={3}
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
