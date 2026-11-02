'use client'

import {
  Input as InputPrimitive,
  type InputProps as InputPrimitiveProps
} from '@base-ui/react/input'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import type { ComponentProps } from 'react'

export type FieldLabelProps = ComponentProps<'label'>

export function FieldLabel({ className, ...props }: FieldLabelProps) {
  return (
    <label
      data-slot="field-label"
      className={cn('grid gap-1.75 text-[12px] font-black tracking-label uppercase', className)}
      {...props}
    />
  )
}

export const inputVariants = cva('border-3 border-ink bg-white text-ink', {
  variants: {
    variant: {
      auth: 'min-h-13.5 rounded-field px-4 font-extrabold focus:outline-4 focus:outline-offset-2 focus:outline-secondary',
      dialog:
        'min-h-13 w-full rounded-field px-3.75 font-extrabold focus:outline-4 focus:outline-offset-2 focus:outline-brand',
      control: 'min-h-13 w-full resize-none rounded-control p-3.5 font-bold'
    }
  },
  defaultVariants: {
    variant: 'dialog'
  }
})

export type TextInputProps = Omit<InputPrimitiveProps, 'className'> &
  VariantProps<typeof inputVariants> & {
    className?: string
  }

export function TextInput({ className, variant, ...props }: TextInputProps) {
  return (
    <InputPrimitive
      data-slot="input"
      className={cn(inputVariants({ variant }), className)}
      {...props}
    />
  )
}

export const textareaVariants = cva('w-full resize-y border-3 border-ink bg-white text-ink', {
  variants: {
    variant: {
      dialog:
        'min-h-31.25 rounded-field px-3.75 pt-3.5 leading-label font-extrabold focus:outline-4 focus:outline-offset-2 focus:outline-brand',
      control: 'min-h-30 rounded-control p-3.5 font-bold'
    }
  },
  defaultVariants: {
    variant: 'dialog'
  }
})

export type TextareaInputProps = ComponentProps<'textarea'> & VariantProps<typeof textareaVariants>

export function TextareaInput({ className, variant, ...props }: TextareaInputProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaVariants({ variant }), className)}
      {...props}
    />
  )
}

export type CheckboxCardProps = Omit<ComponentProps<'input'>, 'type'> & {
  labelClassName?: string
}

export function CheckboxCard({ className, labelClassName, children, ...props }: CheckboxCardProps) {
  return (
    <label
      data-slot="checkbox-card"
      className={cn(
        'col-span-full flex items-start gap-2.75 rounded-xl bg-surface-chip px-3.75 py-3.25 text-[13px] leading-tight-copy font-extrabold phone:col-1',
        labelClassName
      )}
    >
      <input
        type="checkbox"
        className={cn(
          'size-5.25 flex-none accent-accent focus:outline-4 focus:outline-offset-2 focus:outline-brand',
          className
        )}
        {...props}
      />
      <span>{children}</span>
    </label>
  )
}
