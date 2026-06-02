import { useMutation, useQueryClient } from '@tanstack/react-query'
import { balanceKeys } from '../../model/queryKeys'
import { registrarRecaudo } from './api'

export const useRegistrarRecaudo = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: registrarRecaudo,
    onSuccess: () => qc.invalidateQueries({ queryKey: balanceKeys.recaudos() }),
  })
}
