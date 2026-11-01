import { cn } from 'cn'
import type { ComponentProps, ReactNode } from 'react'

import { Eyebrow, type EyebrowProps } from '@/components/ui/eyebrow'

export type SectionIntroProps = Omit<ComponentProps<'div'>, 'title'> & {
  eyebrow: ReactNode
  eyebrowTone?: EyebrowProps['tone']
  title: ReactNode
  titleId?: string
  titleClassName?: string
  description?: ReactNode
  descriptionClassName?: string
}

export function SectionIntro({
  eyebrow,
  eyebrowTone = 'accent',
  title,
  titleId,
  titleClassName,
  description,
  descriptionClassName,
  className,
  ...props
}: SectionIntroProps) {
  return (
    <div data-slot="section-intro" className={cn('max-w-175', className)} {...props}>
      <Eyebrow variant="section" tone={eyebrowTone}>
        {eyebrow}
      </Eyebrow>
      <h2 id={titleId} className={cn('mb-5.5', titleClassName)}>
        {title}
      </h2>
      {description !== undefined && (
        <p
          className={cn(
            'max-w-155 text-[17px] leading-[1.55] font-extrabold',
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}
