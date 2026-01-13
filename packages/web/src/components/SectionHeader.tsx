import PortableTextBlock from '@/components/PortableTextBlock'
import Button from '@/components/Button'
import {cn} from '@/lib/utils'
import {client} from '@/lib/sanity/client'
import {appearanceQuery} from '@/lib/sanity/queries'

interface SectionHeaderProps {
  content?: any[]
  primaryButton?: any
  secondaryButton?: any
  contentClassName?: string
  buttonsClassName?: string
  align?: 'left' | 'center' | 'right'
}

export default async function SectionHeader({
  content,
  primaryButton,
  secondaryButton,
  contentClassName = '',
  buttonsClassName = 'mt-10 flex flex-wrap gap-4',
  align = 'center',
}: SectionHeaderProps) {
  const appearance = await client.fetch(appearanceQuery)
  
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }

  if (!content && !primaryButton && !secondaryButton) return null

  return (
    <div className={cn('flex flex-col', alignmentClasses[align])}>
      {content && (
        <PortableTextBlock 
          value={content} 
          className={contentClassName}
          appearance={appearance}
        />
      )}

      {(primaryButton || secondaryButton) && (
        <div className={cn(buttonsClassName, 'flex flex-wrap gap-4')}>
          {primaryButton && <Button data={primaryButton} appearance={appearance} variant="primary" />}
          {secondaryButton && <Button data={secondaryButton} appearance={appearance} variant="secondary" />}
        </div>
      )}
    </div>
  )
}
