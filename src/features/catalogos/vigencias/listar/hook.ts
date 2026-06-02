// features/catalogos/vigencias/listar/hook.ts
import { useQuery } from '@tanstack/react-query'
import { vigenciasKeys } from '../model/queryKeys'
import { listarVigencias } from './api'

export function useVigencias(estado?: string) {
  return useQuery({
    queryKey: vigenciasKeys.list(estado),
    queryFn:  () => listarVigencias(estado),
    staleTime: 5 * 60 * 1000, // vigencias cambian poco — 5 min de cache
  })
}
