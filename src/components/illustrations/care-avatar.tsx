function CareAvatar({
  furColor = '#d98a4e',
  shirtColor = '#ef6547',
  shortsColor = '#647fa1',
  shoesColor = '#fff8df',
  glassesColor = '#202436',
  outfit = 'shirt',
  hair = 'none'
}) {
  return (
    <svg
      className="care-avatar relative z-2 mt-6.25 h-162.5 w-100 drop-shadow-[12px_15px_0_var(--ink-faint)] phone:h-147.5 phone:w-[min(100%,330px)]"
      viewBox="0 0 400 650"
      role="img"
      aria-label="Avatar de perro antropomórfico con gafas, camiseta, shorts y tenis personalizables"
    >
      <ellipse cx="202" cy="625" rx="132" ry="18" fill="#202436" opacity=".12" />
      <path
        d="M126 403c-58 13-89 55-70 92 13 25 51 13 72-21"
        fill={furColor}
        stroke="#202436"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M151 444c-3 50-8 102-15 148h48l14-111M249 444c3 50 8 102 15 148h-48l-14-111"
        fill={furColor}
        stroke="#202436"
        strokeWidth="9"
        strokeLinejoin="round"
      />
      <path
        d="M91 304c-25 32-37 80-31 126M289 299c29-14 41-46 43-79"
        fill="none"
        stroke="#202436"
        strokeWidth="48"
        strokeLinecap="round"
      />
      <path
        d="M91 304c-25 32-37 80-31 126M289 299c29-14 41-46 43-79"
        fill="none"
        stroke={furColor}
        strokeWidth="32"
        strokeLinecap="round"
      />

      <g fill={furColor} stroke="#202436" strokeWidth="7" strokeLinecap="round">
        <path d="M38 425c-6 20 4 39 22 42 19 2 31-15 26-34-4-18-42-27-48-8z" />
        <path d="M312 203c-3-19 6-38 22-42 18-3 31 13 28 31-3 20-47 29-50 11z" />
        <ellipse cx="318" cy="168" rx="10" ry="19" transform="rotate(-24 318 168)" />
        <ellipse cx="337" cy="157" rx="10" ry="20" transform="rotate(-5 337 157)" />
        <ellipse cx="357" cy="166" rx="10" ry="19" transform="rotate(19 357 166)" />
      </g>
      <path d="M48 438l11 7M63 429l10 7" stroke="#202436" strokeWidth="5" strokeLinecap="round" />

      {outfit === 'shirt' && (
        <>
          <path
            d="M107 273c23-21 163-21 186 0l30 42-37 39-14-20 8 120H120l8-120-14 20-37-39z"
            fill={shirtColor}
            stroke="#202436"
            strokeWidth="9"
            strokeLinejoin="round"
          />
          <path
            d="M119 440h162l-8 99h-61l-12-51-12 51h-61z"
            fill={shortsColor}
            stroke="#202436"
            strokeWidth="9"
            strokeLinejoin="round"
          />
          <path
            d="M128 468h45M227 468h45"
            stroke="#fff8df"
            strokeWidth="7"
            strokeLinecap="round"
            opacity=".9"
          />
        </>
      )}
      {outfit === 'dress' && (
        <>
          <path
            d="M107 273c23-21 163-21 186 0l30 42-37 39-16-22-1 67 49 116c-56 28-180 28-236 0l49-116-1-67-16 22-37-39z"
            fill={shirtColor}
            stroke="#202436"
            strokeWidth="9"
            strokeLinejoin="round"
          />
          <path
            d="M130 399c39 15 101 15 140 0"
            fill="none"
            stroke={shortsColor}
            strokeWidth="11"
            strokeLinecap="round"
          />
          <path
            d="M107 490c48 17 138 17 186 0"
            fill="none"
            stroke="#fff8df"
            strokeWidth="7"
            strokeLinecap="round"
            opacity=".8"
          />
        </>
      )}
      {outfit === 'overalls' && (
        <>
          <path
            d="M107 273c23-21 163-21 186 0l30 42-37 39-18-25-10 80H142l-10-80-18 25-37-39z"
            fill={shortsColor}
            stroke="#202436"
            strokeWidth="9"
            strokeLinejoin="round"
          />
          <path
            d="M130 323h140l12 215h-68l-14-58-14 58h-68z"
            fill={shirtColor}
            stroke="#202436"
            strokeWidth="9"
            strokeLinejoin="round"
          />
          <path
            d="M145 267l18 58M255 267l-18 58"
            stroke="#202436"
            strokeWidth="11"
            strokeLinecap="round"
          />
          <rect
            x="159"
            y="348"
            width="82"
            height="62"
            rx="14"
            fill="#fff8df"
            stroke="#202436"
            strokeWidth="7"
          />
          <circle cx="162" cy="326" r="8" fill="#ffc929" stroke="#202436" strokeWidth="5" />
          <circle cx="238" cy="326" r="8" fill="#ffc929" stroke="#202436" strokeWidth="5" />
        </>
      )}
      <path
        d="M88 324l27 19M312 315l-25 28"
        fill="none"
        stroke="#202436"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M150 257c8 39 92 39 100 0"
        fill="#fff8df"
        stroke="#202436"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <circle cx="200" cy="354" r="32" fill="#ffc929" stroke="#202436" strokeWidth="6" />
      <g fill="#202436">
        <ellipse cx="200" cy="361" rx="11" ry="9" />
        <ellipse cx="188" cy="349" rx="5" ry="7" transform="rotate(-20 188 349)" />
        <ellipse cx="199" cy="344" rx="5" ry="7" />
        <ellipse cx="211" cy="349" rx="5" ry="7" transform="rotate(20 211 349)" />
      </g>

      <path
        d="M108 615c2-24 21-39 44-37l31 7 7 29c-19 13-63 14-82 1zM292 615c-2-24-21-39-44-37l-31 7-7 29c19 13 63 14 82 1z"
        fill={shoesColor}
        stroke="#202436"
        strokeWidth="9"
        strokeLinejoin="round"
      />
      <path
        d="M114 605h69M217 605h69M132 585l20 18M268 585l-20 18"
        fill="none"
        stroke="#202436"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M109 616c17 8 61 8 81-2M210 614c20 10 64 10 81 2"
        fill="none"
        stroke="#202436"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {hair === 'long' && (
        <path
          d="M114 87c-35 45-35 149-12 210l52-18 46 25 46-25 52 18c23-61 23-165-12-210-45-49-127-49-172 0z"
          fill="#6f4937"
          stroke="#202436"
          strokeWidth="9"
          strokeLinejoin="round"
        />
      )}
      <path
        d="M126 104C88 47 60 55 64 111c3 40 30 67 67 70M274 104c38-57 66-49 62 7-3 40-30 67-67 70"
        fill={furColor}
        stroke="#202436"
        strokeWidth="9"
        strokeLinejoin="round"
      />
      <ellipse
        cx="200"
        cy="157"
        rx="101"
        ry="111"
        fill={furColor}
        stroke="#202436"
        strokeWidth="9"
      />
      {hair === 'short' && (
        <path
          d="M126 93c16-44 48-62 74-62s58 18 74 62c-24-14-44-14-56 4-8-17-24-24-38-9-13-13-31-11-54 5z"
          fill="#6f4937"
          stroke="#202436"
          strokeWidth="8"
          strokeLinejoin="round"
        />
      )}
      {hair === 'long' && (
        <path
          d="M119 106c12-52 47-75 81-75s69 23 81 75c-24-18-47-20-62-2-8-18-24-25-40-9-15-10-34-7-60 11z"
          fill="#6f4937"
          stroke="#202436"
          strokeWidth="8"
          strokeLinejoin="round"
        />
      )}
      <path
        d="M142 88c14 18 19 37 15 56M258 88c-14 18-19 37-15 56"
        fill="none"
        stroke="#f3b06e"
        strokeWidth="12"
        strokeLinecap="round"
        opacity=".65"
      />
      <path
        d="M140 126c12-10 27-12 40-5M260 126c-12-10-27-12-40-5"
        fill="none"
        stroke="#202436"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <ellipse cx="158" cy="151" rx="10" ry="14" fill="#202436" />
      <ellipse cx="242" cy="151" rx="10" ry="14" fill="#202436" />
      <circle cx="154" cy="146" r="3" fill="#fff" />
      <circle cx="238" cy="146" r="3" fill="#fff" />
      <ellipse cx="200" cy="194" rx="60" ry="46" fill="#f0b977" />
      <ellipse cx="200" cy="173" rx="19" ry="15" fill="#202436" />
      <path
        d="M165 204c22 35 48 35 70 0-22 9-48 9-70 0z"
        fill="#202436"
        stroke="#202436"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <path d="M185 225c10-8 20-8 30 0" stroke="#ef8a62" strokeWidth="7" strokeLinecap="round" />
      <circle cx="136" cy="190" r="9" fill="#ef8a62" opacity=".55" />
      <circle cx="264" cy="190" r="9" fill="#ef8a62" opacity=".55" />
      <g fill="none" stroke={glassesColor} strokeWidth="8">
        <rect x="119" y="127" width="71" height="53" rx="22" />
        <rect x="210" y="127" width="71" height="53" rx="22" />
        <path d="M190 145h20M119 139l-23-8M281 139l23-8" />
      </g>
    </svg>
  )
}

export { CareAvatar }
