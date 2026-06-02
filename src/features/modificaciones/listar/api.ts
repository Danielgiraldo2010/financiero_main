// GET /api/v1/modificaciones?vigencia=&estado=&pagina=&tamanoPagina=
import { fetcher } from '@/shared/api/fetcher'
import type { PagedResult } from '@/shared/api/types'
import type { ModificacionesParams, SolicitudModificacionResumen } from '../model/types'

export async function fetchModificaciones(
  params: ModificacionesParams,
): Promise<PagedResult<SolicitudModificacionResumen>> {
  const qs = new URLSearchParams()
  if (params.vigencia)     qs.set('vigencia',     String(params.vigencia))
  if (params.estado)       qs.set('estado',        params.estado)
  if (params.pagina)       qs.set('pagina',        String(params.pagina))
  if (params.tamanoPagina) qs.set('tamanoPagina',  String(params.tamanoPagina))

  return fetcher<PagedResult<SolicitudModificacionResumen>>(
    `/api/v1/modificaciones?${qs.toString()}`,
  )
}
