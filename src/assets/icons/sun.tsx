import type { SVGProps } from 'react'

export function Sun({
  'aria-hidden': ariaHidden = 'true',
  viewBox = '0 0 24 24',
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={viewBox} aria-hidden={ariaHidden} {...props}>
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path
        d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
