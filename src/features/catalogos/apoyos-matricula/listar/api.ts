import { fetcher } from "@/shared/api/fetcher"
import type { ListarCatalogosParams, PagedApoyosMatricula } from "../../model/types"

export function listarApoyosMatricula(
  params?: ListarCatalogosParams,
): Promise<PagedApoyosMatricula> {
  const qs = new URLSearchParams()
  qs.set("pagina", String(params?.pagina ?? 1))
  qs.set("elementosPorPagina", String(params?.elementosPorPagina ?? 20))
  return fetcher(`/api/v1/catalogos/apoyos-matricula?${qs.toString()}`)
}
