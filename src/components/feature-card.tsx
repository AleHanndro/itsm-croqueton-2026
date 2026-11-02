import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import Image, { type ImageProps } from 'next/image'
import type { ComponentProps, ReactNode } from 'react'

import { Paw } from '@/assets/icons/paw'

export const featureIconVariants = cva(
  'mb-5.5 grid size-14.5 place-items-center rounded-circle [&_svg]:size-8',
  {
    variants: {
      iconTone: {
        brand: 'bg-brand text-ink',
        accent: 'bg-accent text-card',
        secondary: 'bg-secondary text-ink'
      }
    },
    defaultVariants: {
      iconTone: 'brand'
    }
  }
)

export type FeatureCardProps = Omit<ComponentProps<'article'>, 'title'> &
  VariantProps<typeof featureIconVariants> & {
    title: ReactNode
    description: ReactNode
    icon?: ReactNode
  }

export function FeatureCard({
  title,
  description,
  icon,
  iconTone,
  className,
  ...props
}: FeatureCardProps) {
  return (
    <article
      data-slot="feature-card"
      className={cn(
        'rounded-3xl bg-card px-6.75 py-7.5 text-ink shadow-card phone:px-5.75 phone:py-6.5',
        className
      )}
      {...props}
    >
      <span className={featureIconVariants({ iconTone })}>{icon ?? <Paw />}</span>
      <strong className="block font-heading text-[24px]">{title}</strong>
      <p className="mt-2 text-[15px] leading-[1.55] font-bold">{description}</p>
    </article>
  )
}

export type StepCardProps = Omit<ComponentProps<'article'>, 'title'> & {
  step: ReactNode
  title: ReactNode
  description: ReactNode
  imageSrc: ImageProps['src']
  imageAlt: string
  imageClassName?: string
}

export function StepCard({
  step,
  title,
  description,
  imageSrc,
  imageAlt,
  imageClassName,
  className,
  ...props
}: StepCardProps) {
  return (
    <article
      data-slot="step-card"
      className={cn(
        'relative z-1 origin-center transform-[scale(1)] rounded-[10px_10px_24px_24px] border-t-7 border-accent bg-card px-7 py-8 text-ink opacity-100 shadow-card will-change-[transform,opacity] [transition:transform_0.38s_cubic-bezier(0.2,0.8,0.2,1),opacity_0.38s_ease,box-shadow_0.38s_ease] phone:px-5.75 phone:py-6.75 [@media(hover:hover)_and_(pointer:fine)]:group-has-[article:hover]/steps:not-hover:transform-[scale(0.965)] [@media(hover:hover)_and_(pointer:fine)]:group-has-[article:hover]/steps:not-hover:opacity-58 [@media(hover:hover)_and_(pointer:fine)]:hover:z-3 [@media(hover:hover)_and_(pointer:fine)]:hover:transform-[scale(1.045)] [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[13px_15px_0_#202436]',
        className
      )}
      {...props}
    >
      <span className="mb-5.5 grid size-12 place-items-center rounded-circle bg-brand font-heading text-[20px] font-black">
        {step}
      </span>
      <strong className="block font-heading text-[23px]">{title}</strong>
      <p className="mt-2 text-[15px] leading-[1.55] font-bold">{description}</p>
      <Image
        className={cn(
          'mt-5.5 block w-full rounded-card-sm border-5 border-ink object-cover',
          imageClassName
        )}
        src={imageSrc}
        alt={imageAlt}
      />
    </article>
  )
}
