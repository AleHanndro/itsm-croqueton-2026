'use client'

import { DialogClose, DialogPopup, DialogPortal, DialogRoot, DialogViewport } from '@/components/ui/dialog'
import { createContext, useCallback, useContext, useState } from 'react'

type ConfirmOptions = {
  cancelLabel?: string
  confirmLabel?: string
  description?: string
  title: string
}

type ConfirmContextValue = {
  confirm: (options: ConfirmOptions) => Promise<boolean>
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null)

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null)
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null)

  const confirm = useCallback((next: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setOptions(next)
      setResolver(() => resolve)
    })
  }, [])

  function close(value: boolean) {
    resolver?.(value)
    setResolver(null)
    setOptions(null)
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <DialogRoot open={Boolean(options)} onOpenChange={(open) => !open && close(false)}>
        <DialogPortal>
          <DialogViewport>
            <DialogPopup className="w-[min(460px,100%)] p-8">
              <DialogClose />
              <h2 className="mb-3 font-heading text-[28px] leading-tight">{options?.title}</h2>
              {options?.description && (
                <p className="mb-6 text-small font-extrabold text-muted-foreground">{options.description}</p>
              )}
              <div className="flex justify-end gap-3">
                <button type="button" className="min-h-9 rounded-[9px] border border-stroke-admin-action bg-surface-panel px-4 text-tiny font-black text-foreground" onClick={() => close(false)}>
                  {options?.cancelLabel ?? 'Cancelar'}
                </button>
                <button type="button" className="min-h-9 rounded-[9px] border border-stroke bg-surface-inverse px-4 text-tiny font-black text-fg-admin-approve" onClick={() => close(true)}>
                  {options?.confirmLabel ?? 'Confirmar'}
                </button>
              </div>
            </DialogPopup>
          </DialogViewport>
        </DialogPortal>
      </DialogRoot>
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const context = useContext(ConfirmContext)
  if (!context) throw new Error('useConfirm must be used within ConfirmProvider')
  return context
}
