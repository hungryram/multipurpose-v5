import PortableTextBlock from '@/components/PortableTextBlock'
import Button from '@/components/Button'
import {cn} from '@/lib/utils'

interface SectionHeaderProps {
  content?: any[]
  primaryButton?: any
  secondaryButton?: any
  contentClassName?: string
  buttonsClassName?: string
  align?: 'left' | 'center' | 'right'
}

export default function SectionHeader({
  content,
  primaryButton,
  secondaryButton,
  contentClassName = '',
  buttonsClassName = 'mt-10 flex flex-wrap gap-4',
  align = 'center',
}: SectionHeaderProps) {
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
        />
      )}

      {(primaryButton || secondaryButton) && (
        <div className={cn(buttonsClassName, 'flex flex-wrap gap-4')}>
          {primaryButton && <Button data={primaryButton} variant="primary" />}
          {secondaryButton && <Button data={secondaryButton} variant="secondary" />}
        </div>
      )}
    </div>
  )
}
