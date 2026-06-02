import { useMutation, useQueryClient } from '@tanstack/react-query'
import { balanceKeys } from '../../model/queryKeys'
import { conciliarRecaudo } from './api'

export const useConciliarRecaudo = (id: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (observaciones?: string) => conciliarRecaudo(id, observaciones),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: balanceKeys.recaudo(id) })
      qc.invalidateQueries({ queryKey: balanceKeys.recaudos() })
    },
  })
}
