import { fetcher } from "@/shared/api/fetcher"
import type { EventoSeguimiento } from "../../model/types"

export function getEventosVencidos(): Promise<EventoSeguimiento[]> {
  return fetcher<EventoSeguimiento[]>("/api/v1/dashboard/eventos/vencidos")
}
