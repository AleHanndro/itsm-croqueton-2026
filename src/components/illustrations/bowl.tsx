function Bowl({ empty = false, className = '' }) {
  return (
    <svg viewBox="0 0 300 180" className={className} aria-hidden="true">
      {!empty && (
        <g fill="#744421" stroke="#202436" strokeWidth="4">
          <circle cx="92" cy="54" r="18" />
          <circle cx="126" cy="38" r="18" />
          <circle cx="162" cy="50" r="18" />
          <circle cx="199" cy="40" r="18" />
          <circle cx="221" cy="68" r="18" />
          <circle cx="112" cy="73" r="18" />
          <circle cx="153" cy="74" r="18" />
          <circle cx="188" cy="76" r="18" />
        </g>
      )}
      <path
        d="M41 72h218l-26 77H67z"
        fill="#ef5d45"
        stroke="#202436"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <path d="M41 72h218" stroke="#202436" strokeWidth="12" strokeLinecap="round" />
      <path d="M115 108h70" stroke="#fff7df" strokeWidth="11" strokeLinecap="round" opacity=".9" />
    </svg>
  )
}

export { Bowl }
