'use client'

import { cn, type ClassValue } from 'cn'
import Image from 'next/image'
import { useState, type ComponentProps } from 'react'

import { Paw } from '@/assets/icons/paw'
import { Dog } from '@/components/illustrations/dog'
import { useLanguage } from '@/providers/language-provider'

function PawColorButton({
  color,
  label,
  selected,
  onClick
}: {
  color: string
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className="group/swatch grid justify-items-center gap-1.75 rounded-control border-2 border-[#c7baa0] bg-white px-1.25 py-2.5 text-caption font-black text-ink shadow-[0_3px_0_#c7baa0] [transition:transform_0.18s_ease,box-shadow_0.18s_ease] hover:transform-[translateY(-2px)] hover:shadow-[0_5px_0_#9e927b]! active:transform-[translateY(2px)] active:shadow-none! aria-pressed:border-ink aria-pressed:bg-brand aria-pressed:shadow-[0_4px_0_var(--ink)]!"
      aria-label={`Color ${label}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      <span
        className="grid size-13 place-items-center filter-[drop-shadow(0_3px_0_var(--ink))] group-aria-pressed/swatch:transform-[rotate(-8deg)_scale(1.08)] [&_svg]:size-12 [&_svg]:overflow-visible"
        style={{ color }}
      >
        <Paw />
      </span>
      {label}
    </button>
  )
}

function StoryImage({
  alt,
  className,
  label,
  src
}: {
  alt: string
  className?: ClassValue
  label: string
  src: ComponentProps<typeof Image>['src']
}) {
  return (
    <figure className={cn('absolute z-5 m-0', className)}>
      <span className="absolute -top-2 -left-6.5 z-7 h-6.75 w-21.25 -rotate-35 bg-[rgba(255,235,168,0.88)] shadow-[0_2px_3px_rgba(0,0,0,0.08)]" />
      <span className="absolute -top-2 -right-6.25 z-7 h-6.75 w-21.25 rotate-34 bg-[rgba(255,235,168,0.88)] shadow-[0_2px_3px_rgba(0,0,0,0.08)]" />
      <div className="relative overflow-hidden rounded-control border-8 border-[#f9f4e6] bg-[#f9f4e6] shadow-[15px_18px_0_rgba(15,22,36,0.28)] after:pointer-events-none after:absolute after:inset-0 after:rounded-tag after:border-3 after:border-ink after:content-['']">
        <Image src={src} alt={alt} className="block size-full object-cover" />
      </div>
      <figcaption className="relative mx-auto -mt-2 w-max max-w-[90%] rotate-2 rounded-tag border-0 bg-brand px-4.25 py-2.25 text-center font-heading text-[14px] leading-[1.1] font-extrabold text-ink shadow-none">
        {label}
      </figcaption>
    </figure>
  )
}

function MoodPollCard({
  alt,
  className,
  label,
  src
}: {
  alt: string
  className?: ClassValue
  label: string
  src: ComponentProps<typeof Image>['src']
}) {
  const { language } = useLanguage()
  const [selectedMood, setSelectedMood] = useState<string | null>(null)

  const isEnglish = language === 'en'
  const hasResults = selectedMood !== null

  return (
    <figure className={cn('absolute z-5 m-0', className)}>
      <span className="absolute -top-2 -left-6.5 z-7 h-6.75 w-21.25 -rotate-35 bg-[rgba(255,235,168,0.88)] shadow-[0_2px_3px_rgba(0,0,0,0.08)]" />
      <span className="absolute -top-2 -right-6.25 z-7 h-6.75 w-21.25 rotate-34 bg-[rgba(255,235,168,0.88)] shadow-[0_2px_3px_rgba(0,0,0,0.08)]" />
      <div className="relative overflow-hidden rounded-control border-8 border-[#f9f4e6] bg-[#f9f4e6] shadow-[15px_18px_0_rgba(15,22,36,0.28)] after:pointer-events-none after:absolute after:inset-0 after:rounded-tag after:border-3 after:border-ink after:content-['']">
        <Image src={src} alt={alt} className="block size-full object-cover" />
        <div
          className="absolute right-[1.1%] bottom-[5.8%] left-[33.1%] z-4 grid h-[17.2%] grid-cols-[1fr_1fr] gap-0.5"
          aria-label={isEnglish ? 'How do I look? Poll' : 'Encuesta: c\xF3mo me veo'}
        >
          <button
            type="button"
            className="min-w-0 rounded-l-control border-0 bg-[#fffdf5] px-2.5 py-2 font-heading font-black text-[#259575] uppercase [transition:transform_0.22s_ease,box-shadow_0.22s_ease,padding_0.35s_ease] hover:relative hover:z-2 hover:transform-[scale(1.05)] hover:shadow-[0_7px_15px_var(--ink-soft)]"
            aria-pressed={selectedMood === 'happy'}
            onClick={() => setSelectedMood('happy')}
          >
            <span
              className={cn(
                'flex items-center leading-[0.95]',
                hasResults ? 'justify-between gap-1.25' : 'justify-center'
              )}
            >
              <span
                className={
                  hasResults ? 'text-[clamp(9px,1.25vw,14px)]' : 'text-[clamp(13px,2.3vw,27px)]'
                }
              >
                {isEnglish ? 'Happy' : 'Feliz'}
              </span>
              <strong
                className={cn(
                  'overflow-hidden text-[clamp(13px,1.9vw,22px)] [transition:max-width_0.35s_ease,opacity_0.3s_ease]',
                  hasResults ? 'max-w-11.25 opacity-100' : 'max-w-0 opacity-0'
                )}
              >
                60%
              </strong>
            </span>
            <span
              className={cn(
                'block w-full overflow-hidden rounded-pill bg-[#dedbd1] [transition:height_0.35s_ease,margin-top_0.35s_ease,opacity_0.3s_ease]',
                hasResults ? 'mt-1.75 h-2 opacity-100' : 'mt-0 h-0 opacity-0'
              )}
              aria-hidden="true"
            >
              <span
                className={cn(
                  'block h-full rounded-[inherit] bg-[#38a879] [transition:width_0.65s_cubic-bezier(0.22,1,0.36,1)_0.1s]',
                  hasResults ? 'w-[60%]' : 'w-0'
                )}
              />
            </span>
          </button>
          <button
            type="button"
            className="min-w-0 rounded-r-control border-0 bg-[#fffdf5] px-2.5 py-2 font-heading font-black text-[#a74e71] uppercase [transition:transform_0.22s_ease,box-shadow_0.22s_ease,padding_0.35s_ease] hover:relative hover:z-2 hover:transform-[scale(1.05)] hover:shadow-[0_7px_15px_var(--ink-soft)]"
            aria-pressed={selectedMood === 'crying'}
            onClick={() => setSelectedMood('crying')}
          >
            <span
              className={cn(
                'flex items-center leading-[0.95]',
                hasResults ? 'justify-between gap-1.25' : 'justify-center'
              )}
            >
              <span
                className={
                  hasResults ? 'text-[clamp(9px,1.25vw,14px)]' : 'text-[clamp(13px,2.3vw,27px)]'
                }
              >
                {isEnglish ? 'You were crying' : 'Estuviste llorando'}
              </span>
              <strong
                className={cn(
                  'overflow-hidden text-[clamp(13px,1.9vw,22px)] [transition:max-width_0.35s_ease,opacity_0.3s_ease]',
                  hasResults ? 'max-w-11.25 opacity-100' : 'max-w-0 opacity-0'
                )}
              >
                40%
              </strong>
            </span>
            <span
              className={cn(
                'block w-full overflow-hidden rounded-pill bg-[#dedbd1] [transition:height_0.35s_ease,margin-top_0.35s_ease,opacity_0.3s_ease]',
                hasResults ? 'mt-1.75 h-2 opacity-100' : 'mt-0 h-0 opacity-0'
              )}
              aria-hidden="true"
            >
              <span
                className={cn(
                  'block h-full rounded-[inherit] bg-[#8b5aad] [transition:width_0.65s_cubic-bezier(0.22,1,0.36,1)_0.1s]',
                  hasResults ? 'w-[40%]' : 'w-0'
                )}
              />
            </span>
          </button>
        </div>
        <span
          className="absolute size-px overflow-hidden [clip-path:inset(50%)]"
          aria-live="polite"
        >
          {hasResults
            ? isEnglish
              ? 'Poll results: Happy 60%, You were crying 40%.'
              : 'Resultados: Feliz 60%, Estuviste llorando 40%.'
            : ''}
        </span>
      </div>
      <figcaption className="relative mx-auto -mt-2 w-max max-w-[90%] rotate-2 rounded-tag border-0 bg-brand px-4.25 py-2.25 text-center font-heading text-[14px] leading-[1.1] font-extrabold text-ink shadow-none">
        {label}
      </figcaption>
    </figure>
  )
}

function MemePlaceholder({
  alt,
  className,
  label,
  mood,
  note
}: {
  alt: string
  className?: ClassValue
  label: string
  mood: string
  note: string
}) {
  return (
    <figure
      className={cn(
        'absolute z-5 m-0',
        '[&>div]:grid [&>div]:place-items-center [&>div]:bg-[#f2c65e]',
        className
      )}
    >
      <span className="absolute -top-2 -left-6.5 z-7 h-6.75 w-21.25 -rotate-35 bg-[rgba(255,235,168,0.88)] shadow-[0_2px_3px_rgba(0,0,0,0.08)]" />
      <span className="absolute -top-2 -right-6.25 z-7 h-6.75 w-21.25 rotate-34 bg-[rgba(255,235,168,0.88)] shadow-[0_2px_3px_rgba(0,0,0,0.08)]" />
      <div
        className="relative overflow-hidden rounded-control border-8 border-[#f9f4e6] bg-[#f9f4e6] shadow-[15px_18px_0_rgba(15,22,36,0.28)] after:pointer-events-none after:absolute after:inset-0 after:rounded-tag after:border-3 after:border-ink after:content-['']"
        role="img"
        aria-label={alt}
      >
        <span className="absolute top-4.5 left-1/2 z-2 w-[90%] -translate-x-1/2 text-center font-heading text-[20px] leading-[1.05] font-black uppercase">
          {note}
        </span>
        <Dog mood={mood} className="size-[82%] self-end" />
        <span className="absolute right-3 bottom-3 z-2 rounded-pill bg-ink px-2.5 py-1.5 text-center font-heading text-tiny font-black tracking-label text-white uppercase">
          Tu Cheems va aquí
        </span>
      </div>
      <figcaption className="relative mx-auto -mt-2 w-max max-w-[90%] rotate-2 rounded-tag border-0 bg-brand px-4.25 py-2.25 text-center font-heading text-[14px] leading-[1.1] font-extrabold text-ink shadow-none">
        {label}
      </figcaption>
    </figure>
  )
}

export { PawColorButton, StoryImage, MoodPollCard, MemePlaceholder }
