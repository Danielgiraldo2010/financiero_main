import { useMutation, useQueryClient } from '@tanstack/react-query'
import { liquidacionKeys } from '../model/queryKeys'
import { confirmarPagoNomina, type ConfirmarPagoPayload } from './api'

export function useConfirmarPagoNomina() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      nominaEmpleadoId,
      payload,
    }: {
      nominaEmpleadoId: number
      payload: ConfirmarPagoPayload
    }) => confirmarPagoNomina(nominaEmpleadoId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: liquidacionKeys.all() })
    },
  })
}
