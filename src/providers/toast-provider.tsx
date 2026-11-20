'use client'

import { createContext, useCallback, useContext, useState } from 'react'

type ToastType = 'error' | 'success'

type Toast = {
  id: number
  text: string
  type: ToastType
}

type ToastContextValue = {
  toast: (text: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((text: string, type: ToastType = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((current) => [...current, { id, text, type }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id))
    }, 3500)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed right-4 bottom-4 z-200 grid w-[min(360px,calc(100vw-32px))] gap-2">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={
              item.type === 'error'
                ? 'rounded-2xl border border-[#9e3b28] bg-[#ffe2da] px-4 py-3 text-small font-extrabold text-[#9e3b28] shadow-[4px_4px_0_var(--ink)]'
                : 'rounded-2xl border border-[#2f6b45] bg-[#dff3e9] px-4 py-3 text-small font-extrabold text-[#2f6b45] shadow-[4px_4px_0_var(--ink)]'
            }
          >
            {item.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}
