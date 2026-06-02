import { fetcher } from "@/shared/api/fetcher"
import type { ListarCatalogosParams, PagedFuentesRecursos } from "../../model/types"

export function listarFuentesRecursos(
  params?: ListarCatalogosParams,
): Promise<PagedFuentesRecursos> {
  const qs = new URLSearchParams()
  qs.set("pagina", String(params?.pagina ?? 1))
  qs.set("elementosPorPagina", String(params?.elementosPorPagina ?? 20))
  if (params?.busqueda) qs.set("busqueda", params.busqueda)
  return fetcher(`/api/v1/catalogos/fuentes-recursos?${qs.toString()}`)
}
