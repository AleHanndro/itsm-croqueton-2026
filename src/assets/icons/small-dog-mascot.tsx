import type { SVGProps } from 'react'

export function SmallDogMascot({
  'aria-label': ariaLabel = 'Perrito pequeño sentado con pañuelo azul',
  furColor = '#efc88f',
  viewBox = '0 0 250 300',
  ...props
}: SVGProps<SVGSVGElement> & {
  furColor?: string
}) {
  return (
    <svg viewBox={viewBox} role="img" aria-label={ariaLabel} {...props}>
      <path
        d="M174 218c55-31 72 19 37 49-18 15-35 3-31-14"
        fill={furColor}
        stroke="#202436"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <ellipse cx="125" cy="210" rx="72" ry="74" fill={furColor} stroke="#202436" strokeWidth="9" />
      <path
        d="M75 76L45 20c42 1 61 20 66 57M175 76l30-56c-42 1-61 20-66 57"
        fill={furColor}
        stroke="#202436"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <ellipse cx="125" cy="112" rx="82" ry="77" fill={furColor} stroke="#202436" strokeWidth="9" />
      <path
        d="M73 47l21 31M177 78l21-31"
        stroke="#ef9c9c"
        strokeWidth="10"
        strokeLinecap="round"
        opacity=".8"
      />
      <ellipse cx="125" cy="135" rx="45" ry="35" fill="#fff0bd" />
      <path
        d="M86 108q14-16 28 0M136 108q14-16 28 0"
        fill="none"
        stroke="#202436"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <ellipse cx="125" cy="129" rx="14" ry="11" fill="#202436" />
      <path
        d="M101 145c15 18 33 18 48 0"
        fill="none"
        stroke="#202436"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M62 166c39 22 87 22 126 0l-20 66-43-33-43 33z"
        fill="#4f83bd"
        stroke="#202436"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <path
        d="M83 255l-8 28M167 255l8 28M67 283h35M148 283h35"
        fill="none"
        stroke="#202436"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </svg>
  )
}
