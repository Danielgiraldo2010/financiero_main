import { fetcher } from "@/shared/api/fetcher"
import type { ModificarRubroGastoCommand, RubroGastoResponse } from "../../model/types"
export function modificarRubroGasto(cmd: ModificarRubroGastoCommand): Promise<RubroGastoResponse> {
  return fetcher(`/api/v1/catalogos/rubros-gasto/${cmd.id}`, { method: "PUT", body: JSON.stringify(cmd) })
}