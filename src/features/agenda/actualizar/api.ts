import { fetcher } from "@/shared/api/fetcher"
import type { ActualizarEventoRequest } from "../model/types"

export const actualizarEventoAgenda = (
  id: number,
  body: ActualizarEventoRequest
): Promise<void> =>
  fetcher(`/api/v1/agenda/${id}`, { method: "PUT", body: JSON.stringify(body) })
