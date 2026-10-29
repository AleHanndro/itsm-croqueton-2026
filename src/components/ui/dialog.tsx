'use client'

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { cn } from 'cn'
import type { ComponentProps } from 'react'

export function DialogRoot({ modal = 'trap-focus', ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root modal={modal} {...props} />
}

export const DialogPortal = DialogPrimitive.Portal

export type DialogViewportProps = Omit<DialogPrimitive.Viewport.Props, 'className'> & {
  className?: string
}

export function DialogViewport({ className, ...props }: DialogViewportProps) {
  return (
    <DialogPrimitive.Viewport
      data-slot="dialog-viewport"
      className={cn(
        'fixed inset-0 z-120 grid place-items-center bg-[rgba(15,22,36,0.78)] p-6 backdrop-blur-[7px] phone:p-2.5',
        className
      )}
      {...props}
    />
  )
}

export type DialogPopupProps = Omit<DialogPrimitive.Popup.Props, 'className'> & {
  className?: string
}

export function DialogPopup({
  className,
  initialFocus = false,
  render,
  ...props
}: DialogPopupProps) {
  return (
    <DialogPrimitive.Popup
      data-slot="dialog-popup"
      initialFocus={initialFocus}
      render={render ?? <section />}
      className={cn(
        'relative max-h-[calc(100vh-48px)] w-[min(720px,100%)] overflow-y-auto rounded-4xl border-5 border-stroke bg-card p-10.5 text-ink shadow-join-dialog phone:max-h-[calc(100vh-20px)] phone:rounded-3xl phone:px-5 phone:pt-8.75 phone:pb-7',
        className
      )}
      {...props}
    />
  )
}

export type DialogCloseProps = Omit<DialogPrimitive.Close.Props, 'className'> & {
  className?: string
}

export function DialogClose({ className, children = '×', ...props }: DialogCloseProps) {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      className={cn(
        'absolute top-4.25 right-4.5 z-3 size-11 rounded-circle border-3 border-ink bg-accent text-[29px] leading-none font-black text-white shadow-[3px_4px_0_var(--ink)] phone:top-2.75 phone:right-3',
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Close>
  )
}

export type DialogTitleProps = Omit<DialogPrimitive.Title.Props, 'className'> & {
  className?: string
}

export function DialogTitle({ className, ...props }: DialogTitleProps) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('mt-2 mb-4.5 min-[541px]:text-[clamp(48px,6vw,70px)]', className)}
      {...props}
    />
  )
}

export type DialogDescriptionProps = Omit<DialogPrimitive.Description.Props, 'className'> & {
  className?: string
} & ComponentProps<'p'>

export function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('max-w-150 text-base leading-normal font-extrabold', className)}
      {...props}
    />
  )
}
