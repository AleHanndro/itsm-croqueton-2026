import type { SVGProps } from 'react'

export function Moon({
  'aria-hidden': ariaHidden = 'true',
  viewBox = '0 0 24 24',
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={viewBox} aria-hidden={ariaHidden} {...props}>
      <path d="M20 15.2A8.5 8.5 0 018.8 4 8.5 8.5 0 1020 15.2z" fill="currentColor" />
    </svg>
  )
}
