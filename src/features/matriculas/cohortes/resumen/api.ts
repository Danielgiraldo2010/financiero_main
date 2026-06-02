import type { ResumenMatriculaResponse } from "../../model/types"
import { fetcher } from "@/shared/api/fetcher"

export async function getResumenMatriculas(
  vigencia: number,
  periodo?: string,
  unidadEjecutoraId?: number
): Promise<ResumenMatriculaResponse> {
  const qs = new URLSearchParams({ vigencia: String(vigencia) })
  if (periodo) qs.set("periodo", periodo)
  if (unidadEjecutoraId) qs.set("unidadEjecutoraId", String(unidadEjecutoraId))
  return fetcher<ResumenMatriculaResponse>(`/api/v1/matriculas/resumen?${qs}`)
}
