import { fetcher } from "@/shared/api/fetcher"
import type { ModificarFechaLimiteCommand, FechaLimiteResponse } from "../../model/types"
export function modificarFechaLimite(cmd: ModificarFechaLimiteCommand): Promise<FechaLimiteResponse> {
  return fetcher(`/api/v1/catalogos/fechas-limite/${cmd.id}`, { method: "PUT", body: JSON.stringify(cmd) })
}