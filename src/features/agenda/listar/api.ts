import { fetcher } from "@/shared/api/fetcher"
import type { AgendaEventoResponse, PagedResult } from "../model/types"

export interface ListarEventosParams {
  pagina?: number
  elementosPorPagina?: number
  estado?: string
  tipo?: string
  unidadEjecutoraId?: number
}

export const listarEventosAgenda = (
  params?: ListarEventosParams,
): Promise<PagedResult<AgendaEventoResponse>> => {
  const qs = new URLSearchParams()
  qs.set("pagina", String(params?.pagina ?? 1))
  qs.set("elementosPorPagina", String(params?.elementosPorPagina ?? 20))
  if (params?.estado) qs.set("estado", params.estado)
  if (params?.tipo) qs.set("tipo", params.tipo)
  if (params?.unidadEjecutoraId) qs.set("unidadEjecutoraId", String(params.unidadEjecutoraId))
  return fetcher(`/api/v1/agenda?${qs.toString()}`)
}