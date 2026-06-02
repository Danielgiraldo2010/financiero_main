import { fetcher } from "@/shared/api/fetcher"
import type { AgendaAsignacionResponse, AgregarAsignacionRequest } from "../model/types"

export const listarAsignacionesEvento = (
  id: number
): Promise<AgendaAsignacionResponse[]> =>
  fetcher(`/api/v1/agenda/${id}/asignaciones`)

export const agregarAsignacionEvento = (
  id: number,
  body: AgregarAsignacionRequest
): Promise<number> =>
  fetcher(`/api/v1/agenda/${id}/asignaciones`, {
    method: "POST",
    body: JSON.stringify(body),
  })

export const eliminarAsignacionEvento = (asignacionId: number): Promise<void> =>
  fetcher(`/api/v1/agenda/asignaciones/${asignacionId}/eliminar`, { method: "POST" })

export const marcarVistoAsignacion = (asignacionId: number): Promise<void> =>
  fetcher(`/api/v1/agenda/asignaciones/${asignacionId}/visto`, { method: "POST" })
