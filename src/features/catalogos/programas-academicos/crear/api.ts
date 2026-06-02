import { fetcher } from "@/shared/api/fetcher"
import type { CrearProgramaCommand, ProgramaAcademicoResponse } from "../../model/types"

export function crearProgramaAcademico(
  cmd: CrearProgramaCommand,
): Promise<ProgramaAcademicoResponse> {
  return fetcher("/api/v1/catalogos/programas-academicos", {
    method: "POST",
    body: JSON.stringify(cmd),
  })
}
