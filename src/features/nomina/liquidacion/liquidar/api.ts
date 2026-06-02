import { fetcher } from '@/shared/api/fetcher'
import type { NominaEmpleado } from '../listar/api'

export interface LiquidarPayload {
  empleadoId:    number
  vigencia:      number
  mes:           number
  diasLaborados: number
}

export async function liquidarNomina(
  payload: LiquidarPayload,
): Promise<NominaEmpleado> {
  return fetcher('/api/v1/nomina/liquidacion', {
    method: 'POST',
    body:   JSON.stringify(payload),
  })
}
