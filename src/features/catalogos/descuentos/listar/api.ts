import { fetcher } from "@/shared/api/fetcher"
import type { ListarCatalogosParams, PagedDescuentos } from "../../model/types"

export function listarDescuentos(params?: ListarCatalogosParams): Promise<PagedDescuentos> {
  const qs = new URLSearchParams()
  qs.set("pagina", String(params?.pagina ?? 1))
  qs.set("elementosPorPagina", String(params?.elementosPorPagina ?? 20))
  return fetcher(`/api/v1/catalogos/descuentos?${qs.toString()}`)
}
