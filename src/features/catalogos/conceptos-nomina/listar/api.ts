import { fetcher } from "@/shared/api/fetcher"
import type { ListarCatalogosParams, PagedConceptosNomina } from "../../model/types"

export function listarConceptosNomina(
  params?: ListarCatalogosParams,
): Promise<PagedConceptosNomina> {
  const qs = new URLSearchParams()
  qs.set("pagina", String(params?.pagina ?? 1))
  qs.set("elementosPorPagina", String(params?.elementosPorPagina ?? 20))
  if (params?.busqueda) qs.set("busqueda", params.busqueda)
  return fetcher(`/api/v1/catalogos/conceptos-nomina?${qs.toString()}`)
}
