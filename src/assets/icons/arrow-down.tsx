import type { SVGProps } from 'react'

export function ArrowDown({
  'aria-hidden': ariaHidden = 'true',
  viewBox = '0 0 24 24',
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={viewBox} aria-hidden={ariaHidden} {...props}>
      <path
        d="M12 4v15M6 13l6 6 6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
