import { Paw } from '@/assets/icons/paw'

function PawColorButton({
  color,
  label,
  selected,
  onClick
}: {
  color: string
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className="group/swatch grid justify-items-center gap-1.75 rounded-control border-2 border-[#c7baa0] bg-white px-1.25 py-2.5 text-caption font-black text-ink shadow-[0_3px_0_#c7baa0] [transition:transform_0.18s_ease,box-shadow_0.18s_ease] hover:transform-[translateY(-2px)] hover:shadow-[0_5px_0_#9e927b]! active:transform-[translateY(2px)] active:shadow-none! aria-pressed:border-ink aria-pressed:bg-brand aria-pressed:shadow-[0_4px_0_var(--ink)]!"
      aria-label={`Color ${label}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      <span
        className="grid size-13 place-items-center filter-[drop-shadow(0_3px_0_var(--ink))] group-aria-pressed/swatch:transform-[rotate(-8deg)_scale(1.08)] [&_svg]:size-12 [&_svg]:overflow-visible"
        style={{ color }}
      >
        <Paw />
      </span>
      {label}
    </button>
  )
}

export { PawColorButton }
