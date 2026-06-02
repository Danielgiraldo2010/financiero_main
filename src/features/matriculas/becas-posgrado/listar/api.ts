import type { BecaPosgradoResponse, PagedResult } from "../../model/types"
import { fetcher } from "@/shared/api/fetcher"

export interface ListarBecasParams {
  vigencia?: number
  tipoBeca?: string
  pagina?: number
  tamanoPagina?: number
}

export async function getBecasPosgrado(
  params: ListarBecasParams = {}
): Promise<PagedResult<BecaPosgradoResponse>> {
  const qs = new URLSearchParams()
  if (params.vigencia) qs.set("vigencia", String(params.vigencia))
  if (params.tipoBeca) qs.set("tipo", params.tipoBeca)
  if (params.pagina) qs.set("pagina", String(params.pagina))
  if (params.tamanoPagina) qs.set("tamanoPagina", String(params.tamanoPagina))
  return fetcher<PagedResult<BecaPosgradoResponse>>(`/api/v1/matriculas/becas-posgrado?${qs}`)
}
