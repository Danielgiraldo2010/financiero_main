import { fetcher } from "@/shared/api/fetcher"
import type { EventoSeguimiento, EventosSeguimientoParams } from "../../model/types"

export function getEventosSeguimiento(params?: EventosSeguimientoParams): Promise<EventoSeguimiento[]> {
  const qs = new URLSearchParams()
  if (params?.vigencia)     qs.set("vigencia",     String(params.vigencia))
  if (params?.estado)       qs.set("estado",       params.estado)
  if (params?.pagina)       qs.set("pagina",       String(params.pagina))
  if (params?.tamanoPagina) qs.set("tamanoPagina", String(params.tamanoPagina))
  return fetcher<EventoSeguimiento[]>(`/api/v1/dashboard/eventos?${qs.toString()}`)
}
