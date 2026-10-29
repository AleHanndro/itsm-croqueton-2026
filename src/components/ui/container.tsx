import { cn } from 'cn'
import type { ComponentProps } from 'react'

export type ContainerProps = ComponentProps<'div'> & {
  /**
   * The semantic HTML element to render as
   * @default 'div'
   */
  as?: 'div' | 'nav' | 'section'
}

export function Container({ as: Element = 'div', className, ...props }: ContainerProps) {
  return (
    <Element
      data-slot="container"
      className={cn(
        'relative z-2 mx-auto w-[min(1240px,calc(100%-96px))] tablet:w-[min(100%-36px,680px)] phone:w-[min(100%-28px,680px)] laptop:w-[min(100%-48px,1040px)]',
        className
      )}
      {...props}
    />
  )
}
