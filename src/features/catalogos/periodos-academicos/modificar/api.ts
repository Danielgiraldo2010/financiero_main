import { fetcher } from "@/shared/api/fetcher"
import type { ModificarPeriodoCommand, PeriodoAcademicoResponse } from "../../model/types"
export function modificarPeriodoAcademico(cmd: ModificarPeriodoCommand): Promise<PeriodoAcademicoResponse> {
  return fetcher(`/api/v1/catalogos/periodos-academicos/${cmd.id}`, { method: "PUT", body: JSON.stringify(cmd) })
}