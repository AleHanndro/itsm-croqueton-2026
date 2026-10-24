import type { SVGProps } from 'react'

export function ChevronDown({
  'aria-hidden': ariaHidden = 'true',
  viewBox = '0 0 16 16',
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={viewBox} aria-hidden={ariaHidden} {...props}>
      <path
        d="m4 6 4 4 4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
