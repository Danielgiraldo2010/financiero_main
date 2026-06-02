import { fetcher } from "@/shared/api/fetcher"
import type { ListarCatalogosParams, PagedRubrosGasto } from "../../model/types"

export function listarRubrosGasto(params?: ListarCatalogosParams): Promise<PagedRubrosGasto> {
  const qs = new URLSearchParams()
  qs.set("pagina", String(params?.pagina ?? 1))
  qs.set("elementosPorPagina", String(params?.elementosPorPagina ?? 20))
  if (params?.busqueda) qs.set("busqueda", params.busqueda)
  return fetcher(`/api/v1/catalogos/rubros-gasto?${qs.toString()}`)
}
