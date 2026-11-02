'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import type { ComponentProps } from 'react'

import CommunityNavigation from '@/components/community-navigation'
import { LanguageToggle } from '@/components/layout/language-toggle'
import { SiteNavigation } from '@/components/layout/site-navigation'
import { ThemeToggle } from '@/components/layout/theme-toggle'

export const pageShellVariants = cva('min-h-screen text-foreground', {
  variants: {
    surface: {
      mint: 'bg-surface-page-mint',
      warm: 'bg-surface-page-warm',
      default: 'bg-background',
      'not-found':
        'relative flex items-center bg-surface-not-found-page [&_.page-nav-spacer]:hidden',
      admin: 'bg-surface-admin-page'
    }
  },
  defaultVariants: {
    surface: 'mint'
  }
})

export type PageShellProps = ComponentProps<'main'> &
  VariantProps<typeof pageShellVariants> & {
    navigation?: 'site' | 'community' | 'none'
    showToggles?: boolean
  }

export function PageShell({
  surface,
  navigation = 'site',
  showToggles = true,
  className,
  children,
  ...props
}: PageShellProps) {
  return (
    <main
      data-slot="page-shell"
      className={cn(pageShellVariants({ surface }), className)}
      {...props}
    >
      {showToggles && (
        <>
          <LanguageToggle />
          <ThemeToggle />
        </>
      )}
      {navigation === 'site' && <SiteNavigation />}
      {navigation === 'community' && <CommunityNavigation />}
      {children}
    </main>
  )
}
