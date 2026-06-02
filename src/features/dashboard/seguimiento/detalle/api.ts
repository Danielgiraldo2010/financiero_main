import { fetcher } from "@/shared/api/fetcher"
import type { EventoSeguimiento } from "../../model/types"

export function getEventoSeguimiento(id: number): Promise<EventoSeguimiento> {
  return fetcher<EventoSeguimiento>(`/api/v1/dashboard/eventos/${id}`)
}
