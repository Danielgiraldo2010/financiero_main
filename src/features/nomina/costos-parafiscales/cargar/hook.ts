import { useMutation, useQueryClient } from '@tanstack/react-query'
import { costosParafiscalesKeys } from '../model/queryKeys'
import { cargarCostosParafiscales, type CargarCostosPayload } from './api'

export function useCargarCostosParafiscales() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CargarCostosPayload) => cargarCostosParafiscales(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: costosParafiscalesKeys.all() })
    },
  })
}
