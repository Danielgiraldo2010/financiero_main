import { fetcher } from "@/shared/api/fetcher"
import type { ProgramaAcademicoResponse } from "../../model/types"
export function consultarProgramaAcademico(id: number): Promise<ProgramaAcademicoResponse> {
  return fetcher(`/api/v1/catalogos/programas-academicos/${id}`)
}