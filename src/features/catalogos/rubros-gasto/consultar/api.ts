import { fetcher } from "@/shared/api/fetcher"
import type { RubroGastoResponse } from "../../model/types"
export function consultarRubroGasto(id: number): Promise<RubroGastoResponse> {
  return fetcher(`/api/v1/catalogos/rubros-gasto/${id}`)
}