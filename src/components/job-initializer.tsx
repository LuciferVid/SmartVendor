'use client'

import { useEffect, useState } from 'react'

/**
 * Client component that triggers job initialization on app load
 * Calls the API endpoint to defer server-side job setup
 */
export function JobInitializer() {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (initialized) return

    // Initialize jobs on client load  
    const timer = setTimeout(() => {
      fetch('/api/jobs/initialize', { method: 'GET' })
        .then(() => {
          console.log('[JobInitializer] Background jobs initialized')
          setInitialized(true)
        })
        .catch((error) => console.error('[JobInitializer] Failed to initialize:', error))
    }, 500) // Defer slightly to avoid blocking page render

    return () => clearTimeout(timer)
  }, [initialized])

  return null
}
