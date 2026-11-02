'use client'

import { cn, type ClassValue } from 'cn'
import Image from 'next/image'
import { useState, type ComponentProps } from 'react'

import { StoryPolaroid } from '@/components/home/story-polaroid'
import { useLanguage } from '@/providers/language-provider'

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
    <StoryPolaroid className={className} label={label}>
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
      <span className="absolute size-px overflow-hidden [clip-path:inset(50%)]" aria-live="polite">
        {hasResults
          ? isEnglish
            ? 'Poll results: Happy 60%, You were crying 40%.'
            : 'Resultados: Feliz 60%, Estuviste llorando 40%.'
          : ''}
      </span>
    </StoryPolaroid>
  )
}

export { MoodPollCard }
