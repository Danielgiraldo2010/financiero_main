import { useMutation, useQueryClient } from '@tanstack/react-query'
import { registrarHorasDictadas, type RegistrarHorasPayload } from './api'

// La clave de invalidación usa planClasesId para refrescar la tabla de horas
// del plan específico. Se define localmente — no hay queryKey factory para horas.
const horasKey = (planClasesId: number) =>
  ['nomina', 'horas-dictadas', planClasesId] as const

export function useRegistrarHorasDictadas() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: RegistrarHorasPayload) => registrarHorasDictadas(payload),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: horasKey(variables.planClasesId) })
    },
  })
}

// Exportar la función de query key para que HorasTable pueda usarla
export { horasKey }
