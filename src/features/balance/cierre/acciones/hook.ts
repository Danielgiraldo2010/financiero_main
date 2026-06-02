import { useMutation, useQueryClient } from '@tanstack/react-query'
import { balanceKeys } from '../../model/queryKeys'
import { aprobarCierre, cerrarDefinitivo } from './api'

export const useAprobarCierre = (id: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: aprobarCierre,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: balanceKeys.cierres() })
      qc.invalidateQueries({ queryKey: balanceKeys.cierre(id) })
    },
  })
}

export const useCerrarDefinitivo = (id: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: cerrarDefinitivo,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: balanceKeys.cierres() })
      qc.invalidateQueries({ queryKey: balanceKeys.cierre(id) })
    },
  })
}
