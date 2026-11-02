import { Paw } from '@/assets/icons/paw'

function Logo() {
  return (
    <a
      href="#inicio"
      className="logo inline-flex w-max items-center gap-2.5 font-heading text-title-sm font-extrabold tracking-heading"
      aria-label="Croquetón, volver al inicio"
    >
      <span className="logo-mark grid size-10.75 place-items-center rounded-circle bg-ink text-brand [&_svg]:size-6.25">
        <Paw />
      </span>
      <span>Croquetón</span>
    </a>
  )
}

export { Logo }
