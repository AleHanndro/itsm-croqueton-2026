'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function useLocation() {
  const pathname = usePathname()
  const [hash, setHash] = useState('')

  useEffect(() => {
    function syncHash() {
      setHash(window.location.hash)
    }

    syncHash()
    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [pathname])

  return { pathname, hash }
}

export function useNavigate() {
  const router = useRouter()
  return (target: string) => router.push(target)
}
