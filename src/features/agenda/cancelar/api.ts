import { fetcher } from "@/shared/api/fetcher"
import type { CancelarEventoRequest } from "../model/types"

export const cancelarEventoAgenda = (
  id: number,
  body: CancelarEventoRequest
): Promise<void> =>
  fetcher(`/api/v1/agenda/${id}/cancelar`, { method: "POST", body: JSON.stringify(body) })
