import type { SVGProps } from 'react'

export function Cloud({
  'aria-hidden': ariaHidden = 'true',
  viewBox = '0 0 220 100',
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={viewBox} aria-hidden={ariaHidden} {...props}>
      <path
        d="M21 77c0-17 14-30 31-30 5-25 26-41 52-34 16-16 48-4 50 21 25-2 43 13 43 35 0 6-1 9-3 13H24c-2-2-3-4-3-5z"
        fill="currentColor"
      />
    </svg>
  )
}
