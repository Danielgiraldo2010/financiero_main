import { useMutation, useQueryClient } from '@tanstack/react-query'
import { balanceKeys } from '../../model/queryKeys'
import { registrarRecurso } from './api'

export const useRegistrarRecurso = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: registrarRecurso,
    onSuccess: () => qc.invalidateQueries({ queryKey: balanceKeys.all }),
  })
}
