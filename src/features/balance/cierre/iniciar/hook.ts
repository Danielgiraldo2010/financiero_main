import { useMutation, useQueryClient } from '@tanstack/react-query'
import { balanceKeys } from '../../model/queryKeys'
import { iniciarCierre } from './api'

export const useIniciarCierre = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: iniciarCierre,
    onSuccess: () => qc.invalidateQueries({ queryKey: balanceKeys.cierres() }),
  })
}
