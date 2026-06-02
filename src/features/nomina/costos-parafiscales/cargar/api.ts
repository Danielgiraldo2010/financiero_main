import { fetcher } from '@/shared/api/fetcher'
import type { CostosParafiscales } from '../listar/api'

export interface CargarCostosPayload {
  vigencia:             number
  mes:                  number
  tipoNomina:           string
  porcSaludEmpleador:   number
  porcPensionEmpleador: number
  porcArl:              number
  porcCajaCompensacion: number
  porcIcbf:             number
  porcSena:             number
  factorPrestaciones:   number
}

export async function cargarCostosParafiscales(
  payload: CargarCostosPayload,
): Promise<CostosParafiscales> {
  return fetcher('/api/v1/nomina/costos-parafiscales', {
    method: 'POST',
    body:   JSON.stringify(payload),
  })
}
