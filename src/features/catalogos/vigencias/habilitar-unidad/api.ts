// features/catalogos/vigencias/habilitar-unidad/api.ts
import { fetcher } from '@/shared/api/fetcher'
import type { VigenciaUeResponse } from '../model/types'

export interface HabilitarUnidadCommand {
  vigenciaId: number
  unidadEjecutoraId: number
  techoComunicado: number | null
  fechaComunicacion: string | null
  urlComunicacion: string | null
  observaciones: string | null
}

export function habilitarUnidad(cmd: HabilitarUnidadCommand): Promise<VigenciaUeResponse> {
  return fetcher(`/api/v1/catalogos/vigencias/${cmd.vigenciaId}/habilitar-unidad`, {
    method: 'POST',
    body: JSON.stringify({
      unidadEjecutoraId: cmd.unidadEjecutoraId,
      techoComunicado:   cmd.techoComunicado,
      fechaComunicacion: cmd.fechaComunicacion,
      urlComunicacion:   cmd.urlComunicacion,
      observaciones:     cmd.observaciones,
    }),
  })
}

export function listarUesVigencia(vigenciaId: number): Promise<VigenciaUeResponse[]> {
  return fetcher(`/api/v1/catalogos/vigencias/${vigenciaId}/unidades`)
}
