import type { SVGProps } from 'react'

export function User({
  'aria-hidden': ariaHidden = 'true',
  viewBox = '0 0 24 24',
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={viewBox} aria-hidden={ariaHidden} {...props}>
      <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path
        d="M4.5 21c.7-5 3.2-7.5 7.5-7.5s6.8 2.5 7.5 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}
