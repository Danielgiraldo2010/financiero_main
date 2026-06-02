import { fetcher } from "@/shared/api/fetcher"
import type { TipoProyectoResponse } from "../../model/types"
import type { PagedResult } from "@/shared/api/types"

export function listarTiposProyecto(): Promise<PagedResult<TipoProyectoResponse>> {
  return fetcher("/api/v1/catalogos/tipos-proyecto")
}