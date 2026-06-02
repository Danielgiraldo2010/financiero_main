import { fetcher } from "@/shared/api/fetcher"
import type { ModificarProgramaCommand, ProgramaAcademicoResponse } from "../../model/types"
export function modificarProgramaAcademico(cmd: ModificarProgramaCommand): Promise<ProgramaAcademicoResponse> {
  return fetcher(`/api/v1/catalogos/programas-academicos/${cmd.id}`, { method: "PUT", body: JSON.stringify(cmd) })
}