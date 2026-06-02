import { useMutation, useQueryClient } from '@tanstack/react-query'
import { planClasesKeys } from '../model/queryKeys'
import { cerrarPlanClases, type CerrarPlanClasesPayload } from './api'

export function useCerrarPlanClases() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CerrarPlanClasesPayload }) =>
      cerrarPlanClases(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: planClasesKeys.all() })
    },
  })
}
