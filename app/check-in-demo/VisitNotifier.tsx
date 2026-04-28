'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function VisitNotifier() {
  const pathname = usePathname()

  useEffect(() => {
    if (localStorage.getItem('visit_notified')) return
    localStorage.setItem('visit_notified', '1')
    fetch('/api/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      }),
    }).catch(() => {})
  }, [])

  return null
}
