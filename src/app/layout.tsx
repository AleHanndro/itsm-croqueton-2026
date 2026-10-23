import type { Metadata } from 'next'
import { Baloo_2, Nunito, Space_Mono } from 'next/font/google'

import { MayaTranslationNotice } from '@/components/ui'
import { CommunityProvider } from '@/providers/community-provider'
import { LanguageProvider } from '@/providers/language-provider'
import { ThemeProvider } from '@/providers/theme-provider'

import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Croquetón 2026 - Una croquetita por favor',
    template: '%s - Croquetón 2026'
  },
  description:
    'Segunda edición del Croquetón. ' +
    'Evento de recolección de insumos para nuestros amigos caninos del instituto. ' +
    'Organizado por el departamento de ISC.'
}

const baloo2 = Baloo_2({ subsets: ['latin'], variable: '--font-baloo-2' })
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' })
const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-space-mono',
  weight: ['400', '700']
})

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="es"
      className={`${baloo2.variable} ${nunito.variable} ${spaceMono.variable} antialiased synthesize-none`}
    >
      <body>
        <LanguageProvider>
          <CommunityProvider>
            <ThemeProvider>
              <MayaTranslationNotice />
              <div className="isolate">{children}</div>
            </ThemeProvider>
          </CommunityProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
