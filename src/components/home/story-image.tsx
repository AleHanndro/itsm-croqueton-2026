import type { ClassValue } from 'cn'
import Image from 'next/image'
import type { ComponentProps } from 'react'

import { StoryPolaroid } from '@/components/home/story-polaroid'

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
    <StoryPolaroid className={className} label={label}>
      <Image src={src} alt={alt} className="block size-full object-cover" />
    </StoryPolaroid>
  )
}

export { StoryImage }
