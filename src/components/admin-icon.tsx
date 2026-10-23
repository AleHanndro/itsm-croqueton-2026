export default function AdminIcon({ type }) {
  if (type === 'posts')
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M6 3h9l4 4v14H6zM15 3v5h4M9 12h7M9 16h7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  if (type === 'review')
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M9 4h6M9 3h6v4H9zM7 5H5v16h14V5h-2M8 13l3 3 5-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  if (type === 'users')
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
        <path
          d="M3 20c0-4 2-7 6-7s6 3 6 7M16 6a3 3 0 010 6M17 14c2.5.7 4 2.8 4 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 20S4 16 4 9a4 4 0 017-2.6A4 4 0 0120 9c0 7-8 11-8 11z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}
