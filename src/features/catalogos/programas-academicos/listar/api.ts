// src/features/catalogos/programas-academicos/listar/api.ts
import { fetcher } from "@/shared/api/fetcher"
import type { ListarCatalogosParams, PagedProgramasAcademicos } from "../../model/types"

export function listarProgramasAcademicos(
  params?: ListarCatalogosParams,
): Promise<PagedProgramasAcademicos> {
  const qs = new URLSearchParams()
  qs.set("Pagina",        String(params?.pagina          ?? 1))
  qs.set("TamanoPagina",  String(params?.elementosPorPagina ?? 20))
  if (params?.busqueda) qs.set("Busqueda", params.busqueda)
  return fetcher(`/api/v1/catalogos/programas-academicos?${qs.toString()}`)
}