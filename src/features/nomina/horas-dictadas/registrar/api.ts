import { fetcher } from '@/shared/api/fetcher'
import type { HorasDictadas } from '../../model/types'

export interface RegistrarHorasPayload {
  planClasesId:    number
  mes:             number
  horasProyectadas: number
  horasReales:     number
  justificacion:   string | null
}

export async function registrarHorasDictadas(
  payload: RegistrarHorasPayload,
): Promise<HorasDictadas> {
  return fetcher('/api/v1/nomina/horas-dictadas', {
    method: 'POST',
    body:   JSON.stringify(payload),
  })
}
