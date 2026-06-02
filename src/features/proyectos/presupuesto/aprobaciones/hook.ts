// aprobaciones/hook.ts
// Un hook por transición de estado del presupuesto.
// Todos invalidan presupuestoProyectoKeys.detail + proyectosKeys.detail
// para que el semáforo de estado en la lista también se actualice.

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { presupuestoProyectoKeys } from "../model/queryKeys"
import { proyectosKeys } from "@/features/proyectos/model/queryKeys"
import {
  revisarPresupuesto,
  solicitarAprobacion,
  aprobarDecano,
  aprobarPlaneacion,
  consolidarPresupuesto,
  type CambiarEstadoPayload,
  type ConsolidarPayload,
} from "./api"

// ── Helper interno ─────────────────────────────────────────────────────────
function useTransicionEstado(
  proyectoId: number,
  mutationFn: (payload: CambiarEstadoPayload) => Promise<unknown>,
  successMsg: string,
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: presupuestoProyectoKeys.detail(proyectoId),
      })
      queryClient.invalidateQueries({
        queryKey: proyectosKeys.detail(proyectoId),
      })
      toast.success(successMsg)
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Error al cambiar el estado del presupuesto")
    },
  })
}

// ── Hooks públicos ─────────────────────────────────────────────────────────
export function useRevisar(proyectoId: number) {
  return useTransicionEstado(
    proyectoId,
    (p) => revisarPresupuesto(proyectoId, p),
    "Presupuesto marcado como revisado",
  )
}

export function useSolicitarAprobacion(proyectoId: number) {
  return useTransicionEstado(
    proyectoId,
    (p) => solicitarAprobacion(proyectoId, p),
    "Aprobación solicitada",
  )
}

export function useAprobarDecano(proyectoId: number) {
  return useTransicionEstado(
    proyectoId,
    (p) => aprobarDecano(proyectoId, p),
    "Presupuesto aprobado por Decano",
  )
}

export function useAprobarPlaneacion(proyectoId: number) {
  return useTransicionEstado(
    proyectoId,
    (p) => aprobarPlaneacion(proyectoId, p),
    "Presupuesto aprobado por Planeación",
  )
}

// ── useConsolidar ─────────────────────────────────────────────────────────
// Acción IRREVERSIBLE — siempre pasa por ConsolidarDialog antes de llamar.
// Invalida además presupuestoKeys.all para FE4 (presupuesto UE).
export function useConsolidar(proyectoId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ConsolidarPayload) =>
      consolidarPresupuesto(proyectoId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: presupuestoProyectoKeys.detail(proyectoId),
      })
      queryClient.invalidateQueries({
        queryKey: proyectosKeys.detail(proyectoId),
      })
      // Invalida presupuesto UE (FE4) si ya existe en caché
      queryClient.invalidateQueries({ queryKey: ["presupuesto"] })
      toast.success(
        `Consolidado: ${data.lineasIngresosConsolidadas} ingresos y ` +
          `${data.lineasGastosConsolidadas} gastos transferidos al presupuesto de la UE`,
      )
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Error al consolidar el presupuesto")
    },
  })
}
