import { fetcher } from "@/shared/api/fetcher"
import type { CrearFechaLimiteCommand, FechaLimiteResponse } from "../../model/types"

export function crearFechaLimite(cmd: CrearFechaLimiteCommand): Promise<FechaLimiteResponse> {
  return fetcher("/api/v1/catalogos/fechas-limite", {
    method: "POST",
    body: JSON.stringify(cmd),
  })
}
