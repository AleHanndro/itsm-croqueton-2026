import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import type { ComponentProps } from 'react'

export const eyebrowVariants = cva(
  'inline-flex items-center font-black tracking-[0.16em] uppercase',
  {
    variants: {
      variant: {
        pill: "mb-5 gap-2.25 before:h-1 before:w-3.75 before:rounded-pill before:bg-current before:content-['']",
        section: 'mb-6.25'
      },
      tone: {
        current: '',
        accent: 'text-accent',
        brand: 'text-brand',
        ink: 'text-ink'
      },
      size: {
        sm: 'text-[13px] leading-tight',
        xs: 'text-[9px] leading-tight'
      }
    },
    defaultVariants: {
      variant: 'pill',
      tone: 'current',
      size: 'sm'
    }
  }
)

export type EyebrowProps = ComponentProps<'span'> & VariantProps<typeof eyebrowVariants>

export function Eyebrow({ className, variant, tone, size, ...props }: EyebrowProps) {
  return (
    <span
      data-slot="eyebrow"
      className={cn(eyebrowVariants({ variant, tone, size }), className)}
      {...props}
    />
  )
}
