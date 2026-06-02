import { fetcher } from "@/shared/api/fetcher"
import type { PeriodoAcademicoResponse } from "../../model/types"
export function consultarPeriodoAcademico(id: number): Promise<PeriodoAcademicoResponse> {
  return fetcher(`/api/v1/catalogos/periodos-academicos/${id}`)
}