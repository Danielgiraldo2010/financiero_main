import { fetcher } from "@/shared/api/fetcher"
import type { ListarCatalogosParams, PagedMunicipios } from "../../model/types"

export function listarMunicipios(params?: ListarCatalogosParams): Promise<PagedMunicipios> {
  const qs = new URLSearchParams()
  qs.set("pagina", String(params?.pagina ?? 1))
  qs.set("elementosPorPagina", String(params?.elementosPorPagina ?? 50))
  if (params?.busqueda) qs.set("busqueda", params.busqueda)
  return fetcher(`/api/v1/catalogos/municipios?${qs.toString()}`)
}
