import { useState, useCallback } from 'react'
import type { PaginationParams } from '@/shared/api/types'
import { DEFAULT_PAGE_SIZE } from '@/shared/lib/constants'

interface UsePaginationReturn {
  pagina: number
  tamanoPagina: number
  setPagina: (p: number) => void
  setTamanoPagina: (s: number) => void
  reset: () => void
  params: PaginationParams
}

/**
 * Maneja el estado de paginación.
 * Expone `params` listo para pasar directamente a la API.
 * FE0-I11: sincronización con search params — implementar en cada feature
 * con useSearch/useNavigate de TanStack Router según el contexto de ruta.
 */
export function usePagination(defaultPageSize: number = DEFAULT_PAGE_SIZE): UsePaginationReturn {
  const [pagina, setPaginaState] = useState(1)
  const [tamanoPagina, setTamanoPaginaState] = useState(defaultPageSize)

  const setPagina = useCallback((p: number) => setPaginaState(p), [])

  const setTamanoPagina = useCallback((s: number) => {
    setTamanoPaginaState(s)
    setPaginaState(1) // reset a página 1 al cambiar el tamaño
  }, [])

  const reset = useCallback(() => {
    setPaginaState(1)
    setTamanoPaginaState(defaultPageSize)
  }, [defaultPageSize])

  return {
    pagina,
    tamanoPagina,
    setPagina,
    setTamanoPagina,
    reset,
    params: { pagina, tamanoPagina },
  }
}
