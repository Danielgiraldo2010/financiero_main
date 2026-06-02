import { fetcher } from '@/shared/api/fetcher'
import type { PagoNomina } from '../listar/types'

export interface ConfirmarPagoPayload {
  nominaEmpleadoId: number
  fechaPago:        string        // date ISO
  comprobantePago:  string | null
  urlSoporte:       string | null
  ordenPagoId:      number | null
  observaciones:    string | null
}

// El id en la URL es el mismo nominaEmpleadoId
export async function confirmarPagoNomina(
  nominaEmpleadoId: number,
  payload: ConfirmarPagoPayload,
): Promise<PagoNomina> {
  return fetcher(`/api/v1/nomina/liquidacion/${nominaEmpleadoId}/confirmar-pago`, {
    method: 'POST',
    body:   JSON.stringify(payload),
  })
}
