import { fetcher } from "@/shared/api/fetcher"
import type { FuenteRecursoResponse } from "../../model/types"
export function consultarFuenteRecurso(id: number): Promise<FuenteRecursoResponse> {
  return fetcher(`/api/v1/catalogos/fuentes-recursos/${id}`)
}