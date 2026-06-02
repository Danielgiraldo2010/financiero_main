import { fetcher } from "@/shared/api/fetcher"
import type { FechaLimiteResponse } from "../../model/types"
export function consultarFechaLimite(id: number): Promise<FechaLimiteResponse> {
  return fetcher(`/api/v1/catalogos/fechas-limite/${id}`)
}