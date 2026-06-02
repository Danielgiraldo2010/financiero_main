import { fetcher } from "@/shared/api/fetcher"
import type { CrearRubroGastoCommand, RubroGastoResponse } from "../../model/types"

export function crearRubroGasto(cmd: CrearRubroGastoCommand): Promise<RubroGastoResponse> {
  return fetcher("/api/v1/catalogos/rubros-gasto", {
    method: "POST",
    body: JSON.stringify(cmd),
  })
}
