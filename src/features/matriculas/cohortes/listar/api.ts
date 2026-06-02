import type { CohorteResponse, PagedResult } from "../../model/types"
import { fetcher } from "@/shared/api/fetcher"

export interface ListarCohortesParams {
  vigencia?: number
  periodo?: string
  tipoMatricula?: string
  unidadEjecutoraId?: number
  pagina?: number
  tamanoPagina?: number
}

export async function getCohortes(params: ListarCohortesParams = {}): Promise<PagedResult<CohorteResponse>> {
  const qs = new URLSearchParams()
  if (params.vigencia) qs.set("vigencia", String(params.vigencia))
  if (params.periodo) qs.set("periodo", params.periodo)
  if (params.tipoMatricula) qs.set("tipoMatricula", params.tipoMatricula)
  if (params.unidadEjecutoraId) qs.set("unidadEjecutoraId", String(params.unidadEjecutoraId))
  if (params.pagina) qs.set("pagina", String(params.pagina))
  if (params.tamanoPagina) qs.set("tamanoPagina", String(params.tamanoPagina))
  return fetcher<PagedResult<CohorteResponse>>(`/api/v1/matriculas/cohortes?${qs}`)
}
