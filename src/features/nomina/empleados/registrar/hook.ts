import { useMutation, useQueryClient } from '@tanstack/react-query'
import { empleadosKeys } from '../model/queryKeys'
import { registrarEmpleado, type RegistrarEmpleadoPayload } from './api'

export function useRegistrarEmpleado() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: RegistrarEmpleadoPayload) => registrarEmpleado(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: empleadosKeys.all() })
    },
  })
}
