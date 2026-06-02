import { useMutation, useQueryClient } from '@tanstack/react-query'
import { balanceKeys } from '../../model/queryKeys'
import { registrarConciliacion } from './api'

export const useRegistrarConciliacion = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: registrarConciliacion,
    onSuccess: () => qc.invalidateQueries({ queryKey: balanceKeys.conciliaciones() }),
  })
}
