import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import type { ComponentProps, ReactNode } from 'react'

import { Eyebrow } from '@/components/ui/eyebrow'

export const calloutBannerVariants = cva(
  'flex items-center justify-between text-card tablet:flex-col tablet:items-start phone:mt-13.75 phone:px-6 phone:py-8',
  {
    variants: {
      tone: {
        coral: 'mt-20 gap-10 rounded-[30px] bg-[#f2673f] px-12.5 py-11.25',
        ink: 'mt-21.25 gap-12.5 rounded-4xl bg-ink px-13 py-12'
      }
    },
    defaultVariants: {
      tone: 'coral'
    }
  }
)

export type CalloutBannerProps = Omit<ComponentProps<'div'>, 'title'> &
  VariantProps<typeof calloutBannerVariants> & {
    eyebrow: ReactNode
    title: ReactNode
    description: ReactNode
    action: ReactNode
  }

export function CalloutBanner({
  tone = 'coral',
  eyebrow,
  title,
  description,
  action,
  className,
  ...props
}: CalloutBannerProps) {
  return (
    <div
      data-slot="callout-banner"
      className={cn(calloutBannerVariants({ tone }), className)}
      {...props}
    >
      <div>
        {tone === 'coral' ? (
          <Eyebrow variant="section" tone="ink">
            {eyebrow}
          </Eyebrow>
        ) : (
          <Eyebrow>{eyebrow}</Eyebrow>
        )}
        <h2
          className={cn(
            'text-[clamp(44px,4.2vw,62px)] phone:text-[43px]',
            tone === 'coral' ? 'mt-1.25 mb-2.5' : 'mt-1.5 mb-3'
          )}
        >
          {title}
        </h2>
        <p className={cn('m-0 font-extrabold', tone === 'ink' && 'max-w-155 leading-normal')}>
          {description}
        </p>
      </div>
      {action}
    </div>
  )
}

export const noteCalloutVariants = cva('grid gap-0.75 border-l-5 px-4.25 py-3.5', {
  variants: {
    tone: {
      secondary: 'col-span-full border-secondary bg-[#e7eee7] text-[12px] phone:col-1',
      accent: 'mt-5 max-w-123.75 border-accent bg-surface-trust-note text-[13px] leading-[1.4]'
    }
  },
  defaultVariants: {
    tone: 'secondary'
  }
})

export type NoteCalloutProps = Omit<ComponentProps<'div'>, 'title'> &
  VariantProps<typeof noteCalloutVariants> & {
    title: ReactNode
  }

export function NoteCallout({ tone, title, children, className, ...props }: NoteCalloutProps) {
  return (
    <div
      data-slot="note-callout"
      className={cn(noteCalloutVariants({ tone }), className)}
      {...props}
    >
      <strong className="font-heading text-[16px]">{title}</strong>
      <span>{children}</span>
    </div>
  )
}
