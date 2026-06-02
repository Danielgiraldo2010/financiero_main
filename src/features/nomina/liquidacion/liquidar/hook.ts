import { useMutation, useQueryClient } from '@tanstack/react-query'
import { liquidacionKeys } from '../model/queryKeys'
import { liquidarNomina, type LiquidarPayload } from './api'

export function useLiquidarNomina() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: LiquidarPayload) => liquidarNomina(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: liquidacionKeys.all() })
    },
  })
}
