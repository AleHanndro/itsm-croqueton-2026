import type { SVGProps } from 'react'

export function Paw({
  'aria-hidden': ariaHidden = 'true',
  viewBox = '0 0 80 80',
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={viewBox} aria-hidden={ariaHidden} {...props}>
      <ellipse cx="40" cy="51" rx="22" ry="18" fill="currentColor" />
      <ellipse cx="17" cy="34" rx="9" ry="12" fill="currentColor" transform="rotate(-24 17 34)" />
      <ellipse cx="34" cy="19" rx="9" ry="12" fill="currentColor" transform="rotate(-6 34 19)" />
      <ellipse cx="58" cy="23" rx="9" ry="12" fill="currentColor" transform="rotate(16 58 23)" />
      <ellipse cx="67" cy="43" rx="9" ry="12" fill="currentColor" transform="rotate(30 67 43)" />
    </svg>
  )
}
