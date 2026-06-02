// features/catalogos/vigencias/cambiar-estado-ue/api.ts
import { fetcher } from '@/shared/api/fetcher'
import type { VigenciaUeResponse, CambiarEstadoUeRequest } from '../model/types'

export function cambiarEstadoUe(
  vigenciaId: number,
  ueId: number,
  req: CambiarEstadoUeRequest,
): Promise<VigenciaUeResponse> {
  return fetcher(
    `/api/v1/catalogos/vigencias/${vigenciaId}/unidades/${ueId}/cambiar-estado`,
    {
      method: 'POST',
      body: JSON.stringify(req),
    },
  )
}
