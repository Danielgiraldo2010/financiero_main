// features/integracion/sistemas/listar/api.ts

import { fetcher } from "@/shared/api/fetcher"
import type { SistemaIntegrado } from "../../model/types"
import type { PagedResult } from "@/shared/api/types"

export interface ListarSistemasParams {
  tipo?: string
  estado?: string
  pagina?: number
  elementosPorPagina?: number
}

export function listarSistemas(
  params: ListarSistemasParams = {}
): Promise<PagedResult<SistemaIntegrado>> {
  const { tipo, estado, pagina = 1, elementosPorPagina = 50 } = params

  const qs = new URLSearchParams()
  qs.set("pagina", String(pagina))
  qs.set("elementosPorPagina", String(elementosPorPagina))
  if (tipo) qs.set("tipo", tipo)
  if (estado) qs.set("estado", estado)

  return fetcher(`/api/v1/integracion/sistemas?${qs}`)
}