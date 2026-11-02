'use client'

import { Fieldset as FieldsetPrimitive } from '@base-ui/react/fieldset'
import { Toggle as TogglePrimitive } from '@base-ui/react/toggle'
import { cn } from 'cn'
import type { ReactNode } from 'react'

import { PawColorButton } from '@/components/customizer/paw-color-button'

export type CustomizerFieldsetProps = Omit<FieldsetPrimitive.Root.Props, 'className'> & {
  legend: ReactNode
  className?: string
  legendClassName?: string
}

export function CustomizerFieldset({
  legend,
  className,
  legendClassName,
  children,
  ...props
}: CustomizerFieldsetProps) {
  return (
    <FieldsetPrimitive.Root
      data-slot="customizer-fieldset"
      className={cn('border-t-2 border-dashed border-divider py-6', className)}
      {...props}
    >
      <FieldsetPrimitive.Legend
        data-slot="customizer-legend"
        render={<legend />}
        className={cn('pr-2.5 font-heading text-[18px] font-black', legendClassName)}
      >
        {legend}
      </FieldsetPrimitive.Legend>
      {children}
    </FieldsetPrimitive.Root>
  )
}

export type TogglePillOption<T extends string = string> = {
  value: T
  label: string
}

export type TogglePillGroupProps<T extends string = string> = {
  options: readonly TogglePillOption<T>[]
  value: T
  onValueChange: (value: T) => void
  className?: string
}

export function TogglePillGroup<T extends string = string>({
  options,
  value,
  onValueChange,
  className
}: TogglePillGroupProps<T>) {
  return (
    <div data-slot="toggle-pill-group" className={cn('flex flex-wrap gap-2.25', className)}>
      {options.map((option) => (
        <TogglePrimitive
          key={option.value}
          data-slot="toggle-pill"
          pressed={value === option.value}
          onPressedChange={() => onValueChange(option.value)}
          className="relative rounded-pill border-2 border-ink bg-white px-3.75 py-2.5 font-black text-ink shadow-[0_4px_0_var(--divider)]! transition-[transform,box-shadow] duration-180 ease-[ease] hover:transform-[translateY(-2px)] hover:shadow-[0_6px_0_#8d846f]! active:transform-[translateY(2px)] active:shadow-none! aria-pressed:bg-ink aria-pressed:pr-9.25 aria-pressed:text-card aria-pressed:shadow-[0_4px_0_var(--brand)]! aria-pressed:after:absolute aria-pressed:after:top-1/2 aria-pressed:after:right-2.5 aria-pressed:after:grid aria-pressed:after:size-4.75 aria-pressed:after:-translate-y-1/2 aria-pressed:after:place-items-center aria-pressed:after:rounded-circle aria-pressed:after:bg-brand aria-pressed:after:text-[12px] aria-pressed:after:text-ink aria-pressed:after:content-['✓']"
        >
          {option.label}
        </TogglePrimitive>
      ))}
    </div>
  )
}

export type ColorSwatchOption = {
  color: string
  label: string
}

export type ColorSwatchGroupProps = {
  options: readonly ColorSwatchOption[]
  value: string
  onValueChange: (color: string) => void
  className?: string
}

export function ColorSwatchGroup({
  options,
  value,
  onValueChange,
  className
}: ColorSwatchGroupProps) {
  return (
    <div
      data-slot="color-swatch-group"
      className={cn(
        'grid grid-cols-[repeat(4,1fr)] gap-2.25 phone:grid-cols-[repeat(2,1fr)]',
        className
      )}
    >
      {options.map((option) => (
        <PawColorButton
          key={option.color}
          color={option.color}
          label={option.label}
          selected={value === option.color}
          onClick={() => onValueChange(option.color)}
        />
      ))}
    </div>
  )
}
