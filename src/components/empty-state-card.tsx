import { cn } from 'cn'
import type { ComponentProps, ReactNode } from 'react'

import { Paw } from '@/assets/icons/paw'

export type EmptyStateCardProps = Omit<ComponentProps<'div'>, 'title'> & {
  variant?: 'dashed-feed' | 'generation' | 'donor-wall'
  title: ReactNode
  description?: ReactNode
  iconClassName?: string
}

export function EmptyStateCard({
  variant = 'dashed-feed',
  title,
  description,
  iconClassName,
  className,
  ...props
}: EmptyStateCardProps) {
  if (variant === 'generation') {
    return (
      <div
        data-slot="empty-state-card"
        className={cn(
          'grid min-h-80 place-items-center content-center gap-2.75 rounded-3xl border-4 border-dashed border-stroke bg-surface-generation-placeholder p-6.5 text-center tablet:min-h-65',
          className
        )}
        {...props}
      >
        <Paw className={cn('size-17.5', iconClassName)} />
        <strong className="font-heading text-[20px]">{title}</strong>
        {description !== undefined && (
          <span className="text-[12px] leading-[1.45] font-extrabold opacity-65">
            {description}
          </span>
        )}
      </div>
    )
  }

  if (variant === 'donor-wall') {
    return (
      <div
        data-slot="empty-state-card"
        className={cn(
          'grid min-h-82.5 place-items-center content-center gap-2.5 text-center',
          className
        )}
        {...props}
      >
        <Paw className={cn('size-17.5 -rotate-12 text-[#d8cba9]', iconClassName)} />
        <strong className="max-w-82.5 font-heading text-[23px]">{title}</strong>
        {description !== undefined && (
          <span className="text-[13px] font-extrabold opacity-60">{description}</span>
        )}
      </div>
    )
  }

  return (
    <div
      data-slot="empty-state-card"
      className={cn(
        'grid min-h-55 place-items-center rounded-3xl border-3 border-dashed border-secondary text-center font-black [&_svg]:w-14.5 [&_svg]:text-secondary',
        className
      )}
      {...props}
    >
      <Paw />
      <p>{title}</p>
    </div>
  )
}
