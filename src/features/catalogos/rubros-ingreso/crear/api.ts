import { fetcher } from "@/shared/api/fetcher"
import type { CrearRubroIngresoCommand, RubroIngresoResponse } from "../../model/types"

export function crearRubroIngreso(cmd: CrearRubroIngresoCommand): Promise<RubroIngresoResponse> {
  return fetcher("/api/v1/catalogos/rubros-ingreso", {
    method: "POST",
    body: JSON.stringify(cmd),
  })
}
