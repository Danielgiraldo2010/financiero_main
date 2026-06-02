// features/catalogos/vigencias/modificar/api.ts
import { fetcher } from '@/shared/api/fetcher'
import type { VigenciaResponse } from '../model/types'

export interface ModificarVigenciaCommand {
  id: number
  anio: number
  descripcion: string | null
  fechaInicio: string
  fechaFin: string
  numeroAcuerdoAprobacion: string | null
  fechaAprobacion: string | null
}

export function modificarVigencia(cmd: ModificarVigenciaCommand): Promise<VigenciaResponse> {
  return fetcher(`/api/v1/catalogos/vigencias/${cmd.id}`, {
    method: 'PUT',
    body: JSON.stringify(cmd),
  })
}
