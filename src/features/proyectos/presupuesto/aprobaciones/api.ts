// aprobaciones/api.ts
// Cinco transiciones de estado del presupuesto.
// Todas usan POST con body { vigencia: number } (requerido por el backend).

import { fetcher } from "@/shared/api/fetcher"

export interface CambiarEstadoPayload {
  vigencia: number
}

type EstadoResponse = { estado: string; mensaje?: string }

function accionPresupuesto(
  proyectoId: number,
  accion: string,
  payload: CambiarEstadoPayload,
) {
  return fetcher<EstadoResponse>(
    `/api/v1/proyectos/${proyectoId}/presupuesto/${accion}`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  )
}

export const revisarPresupuesto = (
  proyectoId: number,
  payload: CambiarEstadoPayload,
) => accionPresupuesto(proyectoId, "revisar", payload)

export const solicitarAprobacion = (
  proyectoId: number,
  payload: CambiarEstadoPayload,
) => accionPresupuesto(proyectoId, "solicitar-aprobacion", payload)

export const aprobarDecano = (
  proyectoId: number,
  payload: CambiarEstadoPayload,
) => accionPresupuesto(proyectoId, "aprobar-decano", payload)

export const aprobarPlaneacion = (
  proyectoId: number,
  payload: CambiarEstadoPayload,
) => accionPresupuesto(proyectoId, "aprobar-planeacion", payload)

// Consolidar incluye vigencia (requerida por ConsolidarCommand)
export interface ConsolidarPayload {
  vigencia: number
}

export const consolidarPresupuesto = (
  proyectoId: number,
  payload: ConsolidarPayload,
) =>
  fetcher<{ estado: string; lineasIngresosConsolidadas: number; lineasGastosConsolidadas: number }>(
    `/api/v1/proyectos/${proyectoId}/presupuesto/consolidar`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  )
