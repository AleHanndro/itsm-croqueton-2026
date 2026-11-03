import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { Paw } from '@/assets/icons/paw'
import AdminIcon from '@/components/admin-icon'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'

const adminNavItemVariants = cva(
  'grid min-h-11.5 grid-cols-[24px_1fr_auto] items-center gap-2.75 rounded-xl border-0 px-3.25 text-left text-[13px] font-black [transition:background_0.2s_ease,color_0.2s_ease,transform_0.2s_ease] hover:transform-[translateX(2px)] tablet:min-w-max tablet:grid-cols-[21px_auto_auto] phone:min-h-10 phone:px-2.5 phone:text-[11px] [&_svg]:size-5.25',
  {
    variants: {
      active: {
        true: 'bg-brand text-ink',
        false: 'bg-transparent text-[#bfc3cd] hover:bg-[#2d3245] hover:text-card'
      }
    },
    defaultVariants: {
      active: false
    }
  }
)

export function AdminSidebar({
  userEmail,
  userRole = 'admin',
  pendingCount,
  requestCount = 0,
  onSignOut
}: {
  userEmail: string
  userRole?: 'admin' | 'superadmin'
  pendingCount: number
  requestCount?: number
  onSignOut: () => void
}) {
  return (
    <aside className="sticky top-0 z-20 flex h-screen flex-col bg-surface-admin-sidebar px-5 pt-6.75 pb-5.5 text-card tablet:relative tablet:grid tablet:h-auto tablet:grid-cols-[auto_1fr_auto] tablet:items-center tablet:gap-5 tablet:px-5 tablet:py-4 phone:grid-cols-[1fr_auto] phone:gap-2.5 phone:p-3.5">
      <Link
        href="/"
        className="inline-flex w-max items-center gap-2.5 px-2 font-heading text-[25px] font-extrabold tracking-heading phone:text-sub"
        aria-label="Croquetón"
      >
        <span className="grid size-10.75 place-items-center rounded-circle bg-brand text-ink [&_svg]:size-6.25">
          <Paw />
        </span>
        <span>Croquetón</span>
      </Link>
      <div className="mx-2 mt-4 mb-7.5 w-max rounded-pill border border-[#5c6272] px-2.5 py-1.25 text-micro font-black tracking-[0.14em] text-brand uppercase tablet:hidden">
        Administrador
      </div>
      <nav
        className="grid gap-1.75 tablet:flex tablet:justify-center tablet:overflow-x-auto phone:order-3 phone:col-span-full phone:row-2 phone:justify-start"
        aria-label="Navegación del panel"
      >
        <Link className={adminNavItemVariants({ active: true })} href="/admin#resumen">
          <AdminIcon type="heart" />
          <span>Resumen</span>
        </Link>
        <Link className={adminNavItemVariants()} href="/admin#moderacion">
          <AdminIcon type="review" />
          <span>Moderación</span>
          {pendingCount > 0 && (
            <strong className="grid size-5.75 min-w-5.75 place-items-center rounded-circle bg-accent text-tiny text-white">
              {pendingCount}
            </strong>
          )}
        </Link>
        <Link className={adminNavItemVariants()} href="/admin#comunidad">
          <AdminIcon type="posts" />
          <span>Comunidad</span>
        </Link>
        {userRole === 'superadmin' && (
          <Link className={adminNavItemVariants()} href="/admin/administradores">
            <AdminIcon type="users" />
            <span>Administradores</span>
          </Link>
        )}
        <Link className={adminNavItemVariants()} href="/admin/donadores">
          <AdminIcon type="posts" />
          <span>Donadores</span>
        </Link>
        <Link className={adminNavItemVariants()} href="/admin/solicitudes">
          <AdminIcon type="review" />
          <span>Solicitudes</span>
          {requestCount > 0 && (
            <strong className="grid size-5.75 min-w-5.75 place-items-center rounded-circle bg-accent text-tiny text-white">
              {requestCount}
            </strong>
          )}
        </Link>
        <Link className={adminNavItemVariants()} href="/admin/guaubook">
          <AdminIcon type="users" />
          <span>Ver GuauBook</span>
        </Link>
      </nav>
      <div className="mt-auto grid grid-cols-[39px_minmax(0,1fr)] items-center gap-2.5 border-t border-[#3c4152] px-2 py-4 tablet:hidden">
        <span className="grid size-9.75 place-items-center rounded-xl bg-brand font-heading font-black text-ink">
          A
        </span>
        <div>
          <strong className="block overflow-hidden text-[12px] text-ellipsis whitespace-nowrap">
            Admin Croquetón
          </strong>
          <small className="mt-0.5 block overflow-hidden text-micro font-bold text-ellipsis whitespace-nowrap text-[#959aa8]">
            {userEmail}
          </small>
        </div>
      </div>
      <Button
        variant="underline"
        className="px-2 py-2.5 text-left text-[11px] text-[#f19a89] tablet:text-right phone:col-2 phone:row-1 phone:text-[10px]"
        onClick={onSignOut}
      >
        Cerrar sesión
      </Button>
    </aside>
  )
}

const adminStatIconVariants = cva(
  'grid size-11 flex-none place-items-center rounded-xl [&_svg]:size-5.75',
  {
    variants: {
      tone: {
        posts: 'bg-[#ffe2da] text-accent-deep',
        review: 'bg-surface-note text-[#8b6500]',
        users: 'bg-[#d9efef] text-[#287b7b]',
        heart: 'bg-[#dff3e9] text-[#237d59]'
      }
    },
    defaultVariants: {
      tone: 'posts'
    }
  }
)

export type AdminStatCardProps = VariantProps<typeof adminStatIconVariants> & {
  icon: 'posts' | 'review' | 'users' | 'heart'
  label: ReactNode
  value: ReactNode
  meta: ReactNode
}

export function AdminStatCard({ icon, tone, label, value, meta }: AdminStatCardProps) {
  return (
    <article className="flex min-w-0 items-center gap-3.5 rounded-2xl border border-stroke-card-admin bg-surface-panel p-4.5 text-foreground [transition:transform_0.2s_ease,box-shadow_0.2s_ease] hover:transform-[translateY(-2px)] hover:shadow-[0_7px_20px_rgba(32,36,54,0.07)] phone:p-4">
      <span className={adminStatIconVariants({ tone: tone ?? icon })}>
        <AdminIcon type={icon} />
      </span>
      <div className="grid min-w-0">
        <small className="text-micro font-black tracking-label-wide text-muted-foreground uppercase">
          {label}
        </small>
        <strong className="mt-0.5 -mb-px font-heading text-[30px] leading-none">{value}</strong>
        <span className="overflow-hidden text-tiny font-bold text-ellipsis whitespace-nowrap text-muted-foreground">
          {meta}
        </span>
      </div>
    </article>
  )
}

export function AdminPanelCard({
  as: Component = 'section',
  id,
  eyebrow,
  title,
  description,
  badge,
  footer,
  children
}: {
  as?: 'section' | 'aside'
  id?: string
  eyebrow: ReactNode
  title: ReactNode
  description: ReactNode
  badge?: ReactNode
  footer?: ReactNode
  children: ReactNode
}) {
  return (
    <Component
      className="scroll-mt-5 overflow-hidden rounded-card-sm border border-stroke-card-admin bg-surface-panel text-foreground"
      id={id}
    >
      <div className="flex min-h-26 items-center justify-between gap-5 border-b border-stroke-divider px-5.75 py-5.25 phone:p-4.5">
        <div>
          <Eyebrow variant="section" tone="accent" size="xs" className="mb-1">
            {eyebrow}
          </Eyebrow>
          <h2 className="m-0 text-[27px] tracking-[-0.03em] phone:text-[24px]">{title}</h2>
          <p className="mt-0.5 text-tiny font-bold text-[#777b87]">{description}</p>
        </div>
        {badge !== undefined && (
          <span className="grid h-9 min-w-9 place-items-center rounded-[11px] bg-brand font-heading text-[16px] font-black">
            {badge}
          </span>
        )}
      </div>
      {children}
      {footer}
    </Component>
  )
}
