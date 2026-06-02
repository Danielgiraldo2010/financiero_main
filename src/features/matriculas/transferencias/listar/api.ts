import type { TransferenciaInternaResponse, PagedResult } from "../../model/types"
import { fetcher } from "@/shared/api/fetcher"

export interface ListarTransferenciasParams {
  vigencia?: number
  tipoTransferencia?: string
  pagina?: number
  tamanoPagina?: number
}

export async function getTransferencias(
  params: ListarTransferenciasParams = {}
): Promise<PagedResult<TransferenciaInternaResponse>> {
  const qs = new URLSearchParams()
  if (params.vigencia) qs.set("vigencia", String(params.vigencia))
  if (params.tipoTransferencia) qs.set("tipo", params.tipoTransferencia)
  if (params.pagina) qs.set("pagina", String(params.pagina))
  if (params.tamanoPagina) qs.set("tamanoPagina", String(params.tamanoPagina))
  return fetcher<PagedResult<TransferenciaInternaResponse>>(`/api/v1/matriculas/transferencias?${qs}`)
}
