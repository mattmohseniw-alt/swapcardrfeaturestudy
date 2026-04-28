'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function VisitNotifier() {
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      }),
    }).catch(() => {})
  }, [pathname])

  return null
}
