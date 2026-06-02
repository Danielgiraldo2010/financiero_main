import { fetcher } from "@/shared/api/fetcher"
import type { CrearPeriodoCommand, PeriodoAcademicoResponse } from "../../model/types"

export function crearPeriodoAcademico(
  cmd: CrearPeriodoCommand,
): Promise<PeriodoAcademicoResponse> {
  return fetcher("/api/v1/catalogos/periodos-academicos", {
    method: "POST",
    body: JSON.stringify(cmd),
  })
}
