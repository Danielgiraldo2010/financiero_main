import { fetcher } from "@/shared/api/fetcher"
import type { ListarConFiltroParams, PagedPeriodosAcademicos } from "../../model/types"

export function listarPeriodosAcademicos(
  params?: ListarConFiltroParams,
): Promise<PagedPeriodosAcademicos> {
  const qs = new URLSearchParams()
  qs.set("pagina", String(params?.pagina ?? 1))
  qs.set("elementosPorPagina", String(params?.elementosPorPagina ?? 20))
  if (params?.vigencia) qs.set("vigencia", String(params.vigencia))
  return fetcher(`/api/v1/catalogos/periodos-academicos?${qs.toString()}`)
}
