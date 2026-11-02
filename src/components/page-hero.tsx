import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import Image, { type ImageProps } from 'next/image'
import type { ComponentProps, ReactNode } from 'react'

import { Container } from '@/components/ui/container'
import { Eyebrow } from '@/components/ui/eyebrow'

export const pageHeroVariants = cva('', {
  variants: {
    surface: {
      bar: 'bg-surface-bar',
      soft: 'bg-surface-soft'
    },
    spacing: {
      default: 'pt-22.5 pb-27.5 phone:pt-15 phone:pb-20',
      compact: 'pt-22.5 pb-26.25 phone:pt-15 phone:pb-20',
      donation: 'pt-21.25 pb-26.25 phone:pt-15 phone:pb-20',
      guaubook: 'pt-21.5 pb-23 phone:pt-14.5 phone:pb-16.25',
      studio: 'pt-18.75 pb-17.5 phone:py-13.75'
    }
  },
  defaultVariants: {
    surface: 'soft',
    spacing: 'default'
  }
})

export type PageHeroProps = Omit<ComponentProps<'section'>, 'title'> &
  VariantProps<typeof pageHeroVariants> & {
    eyebrow: ReactNode
    title: ReactNode
    accentTitle?: ReactNode
    description: ReactNode
    actions?: ReactNode
    aside?: ReactNode
    backdrop?: ReactNode
    containerClassName?: string
    titleClassName?: string
    descriptionClassName?: string
  }

export function PageHero({
  surface,
  spacing,
  eyebrow,
  title,
  accentTitle,
  description,
  actions,
  aside,
  backdrop,
  className,
  containerClassName,
  titleClassName,
  descriptionClassName,
  ...props
}: PageHeroProps) {
  const content = (
    <div>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1
        className={cn(
          'mt-3.5 mb-7 text-[clamp(62px,6.3vw,96px)] leading-[0.85] font-extrabold phone:text-[52px]',
          titleClassName
        )}
      >
        {title}
        {accentTitle !== undefined && (
          <>
            <br />
            <span className="text-accent">{accentTitle}</span>
          </>
        )}
      </h1>
      <p className={cn('max-w-155 text-[17px] leading-[1.6] font-extrabold', descriptionClassName)}>
        {description}
      </p>
      {actions}
    </div>
  )

  return (
    <section
      data-slot="page-hero"
      className={cn(pageHeroVariants({ surface, spacing }), className)}
      {...props}
    >
      {backdrop}
      <Container
        className={cn(
          aside ? 'grid items-center tablet:grid-cols-[1fr]' : undefined,
          containerClassName
        )}
      >
        {aside ? (
          <>
            {content}
            {aside}
          </>
        ) : (
          content.props.children
        )}
      </Container>
    </section>
  )
}

export type PolaroidFigureProps = ComponentProps<'figure'> & {
  src: ImageProps['src']
  alt: string
  caption: ReactNode
  tapes?: boolean
  speechBubble?: ReactNode
  imageClassName?: string
  captionClassName?: string
}

export function PolaroidFigure({
  src,
  alt,
  caption,
  tapes = false,
  speechBubble,
  className,
  imageClassName,
  captionClassName,
  ...props
}: PolaroidFigureProps) {
  return (
    <figure data-slot="polaroid-figure" className={cn('rotate-2', className)} {...props}>
      {tapes && (
        <>
          <span className="absolute -top-2 -left-6.5 z-7 h-6.75 w-21.25 -rotate-35 bg-[rgba(255,235,168,0.88)] shadow-[0_2px_3px_rgba(0,0,0,0.08)]" />
          <span className="absolute -top-2 -right-6.25 z-7 h-6.75 w-21.25 rotate-34 bg-[rgba(255,235,168,0.88)] shadow-[0_2px_3px_rgba(0,0,0,0.08)]" />
        </>
      )}
      {speechBubble && (
        <p className="absolute -top-6.25 -right-7 z-2 m-0 w-[min(310px,82%)] -rotate-4 rounded-[22px_22px_4px_22px] border-3 border-ink bg-brand px-4.75 py-3.75 text-center font-heading text-[18px] leading-[1.15] font-black text-ink shadow-pop phone:-top-4.25 phone:-right-1 phone:text-body-sm">
          {speechBubble}
        </p>
      )}
      <Image
        src={src}
        alt={alt}
        className={cn(
          'block w-full rounded-3xl border-10 border-card object-cover shadow-[16px_18px_0_rgba(32,36,54,0.23)]',
          imageClassName
        )}
      />
      <figcaption
        className={cn(
          'relative mx-auto -mt-3.5 w-max max-w-[88%] -rotate-3 rounded-lg bg-ink px-4 py-2.5 text-center font-heading font-black text-card',
          captionClassName
        )}
      >
        {caption}
      </figcaption>
    </figure>
  )
}
