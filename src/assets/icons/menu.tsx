import type { SVGProps } from 'react'

export function Menu({
  'aria-hidden': ariaHidden = 'true',
  viewBox = '0 0 24 24',
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={viewBox} aria-hidden={ariaHidden} {...props}>
      <path
        d="M4 6h16M4 12h16M4 18h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
