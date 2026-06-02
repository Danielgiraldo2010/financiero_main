import { fetcher } from "@/shared/api/fetcher"
import type { NormaResponse, ListarNormasParams, PagedResult } from "../model/types"

export const listarNormas = (
  params?: ListarNormasParams,
): Promise<PagedResult<NormaResponse>> => {
  const qs = new URLSearchParams()
  qs.set("pagina", String(params?.pagina ?? 1))
  qs.set("elementosPorPagina", String(params?.elementosPorPagina ?? 20))
  if (params?.tipo) qs.set("tipo", params.tipo)
  if (params?.ambito) qs.set("ambito", params.ambito)
  if (params?.vigente !== undefined) qs.set("vigente", String(params.vigente))
  return fetcher(`/api/v1/normatividad?${qs.toString()}`)
}