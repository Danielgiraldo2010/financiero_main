import { useMutation, useQueryClient } from '@tanstack/react-query'
import { balanceKeys } from '../../model/queryKeys'
import { conciliarBalance } from './api'

export const useConciliarBalance = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: conciliarBalance,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: balanceKeys.conciliaciones() })
      qc.invalidateQueries({ queryKey: balanceKeys.conciliacionDiferencias() })
    },
  })
}
