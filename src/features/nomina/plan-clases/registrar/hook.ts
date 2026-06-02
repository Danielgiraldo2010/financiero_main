import { useMutation, useQueryClient } from '@tanstack/react-query'
import { planClasesKeys } from '../model/queryKeys'
import { registrarPlanClases, type RegistrarPlanClasesPayload } from './api'

export function useRegistrarPlanClases() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: RegistrarPlanClasesPayload) => registrarPlanClases(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: planClasesKeys.all() })
    },
  })
}
