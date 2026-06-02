import { fetcher } from "@/shared/api/fetcher"
import type { MiAgendaItemResponse, MiAgendaParams, PagedResult } from "../model/types"

export const getMiAgenda = (
  params: MiAgendaParams,
): Promise<PagedResult<MiAgendaItemResponse>> => {
  const qs = new URLSearchParams()
  qs.set("usuarioId", params.usuarioId)
  qs.set("pagina", String(params.pagina ?? 1))
  qs.set("elementosPorPagina", String(params.elementosPorPagina ?? 20))
  if (params.rol) qs.set("rol", params.rol)
  if (params.unidadEjecutoraId) qs.set("unidadEjecutoraId", String(params.unidadEjecutoraId))
  if (params.estado) qs.set("estado", params.estado)
  if (params.fechaDesde) qs.set("fechaDesde", params.fechaDesde)
  if (params.fechaHasta) qs.set("fechaHasta", params.fechaHasta)
  return fetcher(`/api/v1/agenda/mi-agenda?${qs.toString()}`)
}