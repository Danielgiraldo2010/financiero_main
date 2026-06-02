import { useMutation, useQueryClient } from '@tanstack/react-query'
import { empleadosKeys } from '../model/queryKeys'
import { desactivarEmpleado, type DesactivarEmpleadoPayload } from './api'

export function useDesactivarEmpleado() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: DesactivarEmpleadoPayload }) =>
      desactivarEmpleado(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: empleadosKeys.all() })
    },
  })
}
