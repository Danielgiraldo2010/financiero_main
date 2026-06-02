import { useState, useEffect } from 'react'
import { DEFAULT_DEBOUNCE_MS } from '@/shared/lib/constants'

/**
 * Retrasa la actualización de un valor hasta que deje de cambiar.
 * Útil para evitar queries excesivas en campos de búsqueda.
 */
export function useDebounce<T>(value: T, delay: number = DEFAULT_DEBOUNCE_MS): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
