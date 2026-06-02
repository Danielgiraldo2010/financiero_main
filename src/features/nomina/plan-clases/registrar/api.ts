import { fetcher } from '@/shared/api/fetcher'
import type { PlanClases } from '../../model/types'

// Alineado con RegistrarPlanClasesCommand del OpenAPI real.
// NO tiene factorPrestaciones — el plan original era incorrecto.
export interface RegistrarPlanClasesPayload {
  empleadoId:          number
  periodoAcademicoId:  number
  programaAcademicoId: number
  asignatura:          string
  codigoAsignatura:    string | null
  grupo:               string | null
  horasSemanales:      number
  semanas:             number
  normaLiquidacion:    string
  puntosSalarialesId:  number | null
  observaciones:       string | null
}

export async function registrarPlanClases(
  payload: RegistrarPlanClasesPayload,
): Promise<PlanClases> {
  return fetcher('/api/v1/nomina/plan-clases', {
    method: 'POST',
    body:   JSON.stringify(payload),
  })
}
