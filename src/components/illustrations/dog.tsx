function Dog({ mood = 'cool', className = '' }) {
  const sad = mood === 'sad' || mood === 'sick'
  const strong = mood === 'strong'
  return (
    <svg
      viewBox="0 0 520 520"
      className={className}
      role="img"
      aria-label={`Perrito ${strong ? 'fuerte y feliz' : sad ? 'triste' : 'feliz'}`}
    >
      <g className="dog-shadow">
        <ellipse cx="262" cy="466" rx="142" ry="28" fill="#202436" opacity=".16" />
      </g>
      {strong && (
        <g fill="#c8753c" stroke="#202436" strokeWidth="8" strokeLinejoin="round">
          <path d="M167 335c-39-35-85-17-91 22-5 31 19 54 52 43 16-5 27-21 28-41l32 22z" />
          <path d="M353 335c39-35 85-17 91 22 5 31-19 54-52 43-16-5-27-21-28-41l-32 22z" />
          <path d="M85 358c-22-5-32 10-28 26 5 19 30 22 49 9M435 358c22-5 32 10 28 26-5 19-30 22-49 9" />
        </g>
      )}
      <path
        d={
          strong
            ? 'M165 326c17-43 50-68 95-68s79 25 96 68l16 109H148z'
            : 'M185 327c16-41 42-63 76-63s60 22 75 63l20 111H165z'
        }
        fill="#d98a4e"
        stroke="#202436"
        strokeWidth="9"
        strokeLinejoin="round"
      />
      <path
        d="M188 388c35 17 111 17 145 0"
        fill="none"
        stroke="#202436"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M192 427l-21 39M331 427l21 39"
        stroke="#202436"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path d="M174 468h52M298 468h52" stroke="#202436" strokeWidth="16" strokeLinecap="round" />
      <path
        d="M178 176c-34-69-101-60-103-13-2 49 58 82 112 74z"
        fill="#9f592f"
        stroke="#202436"
        strokeWidth="9"
      />
      <path
        d="M342 176c34-69 101-60 103-13 2 49-58 82-112 74z"
        fill="#9f592f"
        stroke="#202436"
        strokeWidth="9"
      />
      <path
        d="M151 205c0-78 48-135 110-135s109 57 109 135c0 72-42 128-109 128s-110-56-110-128z"
        fill="#dc8c50"
        stroke="#202436"
        strokeWidth="9"
      />
      <path
        d="M216 82c12 25 12 48 0 70M302 82c-12 25-12 48 0 70"
        fill="none"
        stroke="#f3b06e"
        strokeWidth="15"
        strokeLinecap="round"
      />
      {mood === 'cool' ? (
        <>
          <g fill="#202436" stroke="#202436" strokeWidth="8">
            <path d="M168 177h78c3 39-14 58-40 58-29 0-40-24-38-58z" />
            <path d="M276 177h78c2 34-9 58-39 58-27 0-44-20-39-58z" />
            <path d="M244 186c10-8 22-8 34 0" fill="none" />
          </g>
          <path d="M179 189l51-5M287 189l49-5" stroke="#fff" strokeWidth="8" opacity=".55" />
        </>
      ) : (
        <>
          <path
            d={sad ? 'M186 207q20-18 40 0M296 207q20-18 40 0' : 'M190 194h30M302 194h30'}
            fill="none"
            stroke="#202436"
            strokeWidth="9"
            strokeLinecap="round"
          />
          {mood === 'sick' && (
            <>
              <path
                d="M194 224c-4 13-11 18-11 26a12 12 0 0024 0c0-8-8-14-13-26zM323 224c-4 13-11 18-11 26a12 12 0 0024 0c0-8-8-14-13-26z"
                fill="#76bde8"
              />
              <path
                d="M155 184l33-22M333 162l34 22"
                stroke="#202436"
                strokeWidth="8"
                strokeLinecap="round"
              />
            </>
          )}
        </>
      )}
      <ellipse cx="261" cy="241" rx="30" ry="25" fill="#202436" />
      <path
        d={sad ? 'M230 292q31-25 62 0' : 'M226 276q35 35 70 0'}
        fill={sad ? 'none' : '#fff'}
        stroke="#202436"
        strokeWidth="8"
        strokeLinecap="round"
      />
      {strong && (
        <path
          d="M219 350l18 20 24-22 24 22 19-20"
          fill="none"
          stroke="#f4c64e"
          strokeWidth="10"
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}

export { Dog }
