import { fetcher } from "@/shared/api/fetcher"
import type { ModificarRubroIngresoCommand, RubroIngresoResponse } from "../../model/types"
export function modificarRubroIngreso(cmd: ModificarRubroIngresoCommand): Promise<RubroIngresoResponse> {
  return fetcher(`/api/v1/catalogos/rubros-ingreso/${cmd.id}`, {
    method: "PUT",
    body: JSON.stringify(cmd),
  })
}