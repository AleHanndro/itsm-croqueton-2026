import { cn, type ClassValue } from 'cn'
import type { ComponentProps, ReactNode } from 'react'

type StoryPolaroidProps = {
  children: ReactNode
  className?: ClassValue
  frameProps?: ComponentProps<'div'>
  label: string
}

function StoryPolaroid({ children, className, frameProps, label }: StoryPolaroidProps) {
  return (
    <figure className={cn('absolute z-5 m-0', className)}>
      <span className="absolute -top-2 -left-6.5 z-7 h-6.75 w-21.25 -rotate-35 bg-[rgba(255,235,168,0.88)] shadow-[0_2px_3px_rgba(0,0,0,0.08)]" />
      <span className="absolute -top-2 -right-6.25 z-7 h-6.75 w-21.25 rotate-34 bg-[rgba(255,235,168,0.88)] shadow-[0_2px_3px_rgba(0,0,0,0.08)]" />
      <div
        {...frameProps}
        className="relative overflow-hidden rounded-control border-8 border-[#f9f4e6] bg-[#f9f4e6] shadow-[15px_18px_0_rgba(15,22,36,0.28)] after:pointer-events-none after:absolute after:inset-0 after:rounded-tag after:border-3 after:border-ink after:content-['']"
      >
        {children}
      </div>
      <figcaption className="relative mx-auto -mt-2 w-max max-w-[90%] rotate-2 rounded-tag border-0 bg-brand px-4.25 py-2.25 text-center font-heading text-[14px] leading-[1.1] font-extrabold text-ink shadow-none">
        {label}
      </figcaption>
    </figure>
  )
}

export { StoryPolaroid }
