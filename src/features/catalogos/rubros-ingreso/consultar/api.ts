import { fetcher } from "@/shared/api/fetcher"
import type { RubroIngresoResponse } from "../../model/types"
export function consultarRubroIngreso(id: number): Promise<RubroIngresoResponse> {
  return fetcher(`/api/v1/catalogos/rubros-ingreso/${id}`)
}