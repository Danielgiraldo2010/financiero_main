import { fetcher } from "@/shared/api/fetcher"
import type { CompletarEventoRequest } from "../model/types"

export const completarEventoAgenda = (
  id: number,
  body: CompletarEventoRequest
): Promise<void> =>
  fetcher(`/api/v1/agenda/${id}/completar`, { method: "POST", body: JSON.stringify(body) })
