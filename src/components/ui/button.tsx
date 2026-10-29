'use client'

import {
  Button as ButtonPrimitive,
  type ButtonProps as ButtonPrimitiveProps
} from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'

export const buttonVariants = cva('', {
  variants: {
    variant: {
      primary:
        "relative inline-flex items-center justify-center gap-3.5 rounded-full border-3 border-current bg-ink font-black text-white shadow-[0_7px_0_var(--button-drop)] [transition:transform_0.2s_ease,box-shadow_0.2s_ease] after:inline-grid after:size-7.5 after:flex-none after:place-items-center after:rounded-circle after:bg-white/18 after:text-lg after:leading-none after:content-['→'] after:[transition:transform_0.2s_ease] hover:transform-[translateY(-3px)_rotate(-1deg)] hover:after:transform-[translateX(3px)] active:transform-[translateY(4px)] active:shadow-none!",
      hero: "relative inline-flex min-h-16.5 items-center justify-center gap-3.5 rounded-full border-3 border-current bg-surface-inverse pr-5.5 pl-8.5 text-[20px] font-black text-fg-cta shadow-[0_9px_0_var(--accent-deep)] [transition:transform_0.2s_ease,box-shadow_0.2s_ease] after:inline-grid after:size-9 after:flex-none after:place-items-center after:rounded-circle after:bg-brand after:text-lg after:leading-none after:text-ink after:content-['→'] after:[transition:transform_0.2s_ease] hover:transform-[translateY(-3px)_rotate(-1deg)] hover:after:transform-[translateX(3px)] active:transform-[translateY(4px)] active:shadow-none!",
      'card-cta':
        'relative inline-flex min-h-17 items-center justify-center gap-7.5 rounded-full border-3 border-current bg-card px-8.5 text-[20px] font-black text-ink shadow-[0_9px_0_var(--accent-deep)] [transition:transform_0.2s_ease,box-shadow_0.2s_ease] hover:transform-[translateY(-3px)_rotate(-1deg)] active:transform-[translateY(4px)] active:shadow-none! [&_span]:text-[31px] [&_span]:leading-0',
      'link-border': 'border-b-3 border-current bg-transparent pb-0.5 font-black',
      underline: 'border-0 bg-transparent font-black underline underline-offset-4'
    },
    size: {
      md: '',
      sm: ''
    }
  },
  compoundVariants: [
    {
      variant: 'primary',
      size: 'md',
      className: 'min-h-14 pr-4.5 pl-6.75'
    },
    {
      variant: 'primary',
      size: 'sm',
      className: 'min-h-12 pr-4.5 pl-6.75'
    }
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'md'
  }
})

export type ButtonProps = Omit<ButtonPrimitiveProps, 'className'> &
  VariantProps<typeof buttonVariants> & {
    className?: string
  }

export function Button({ className, variant, size, render, nativeButton, ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      render={render}
      nativeButton={nativeButton ?? !render}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
