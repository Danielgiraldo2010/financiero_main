// src/features/proyectos/presupuesto/lineas/hook.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { presupuestoProyectoKeys } from "../model/queryKeys"
import {
  getPresupuesto,
  agregarIngreso,
  agregarGasto,
  type AgregarIngresoPayload,
  type AgregarGastoPayload,
} from "./api"

// ── useLineasPresupuesto ───────────────────────────────────────────────────
// vigencia es requerido por el backend — viene de proyecto.vigenciaActiva
export function useLineasPresupuesto(proyectoId: number, vigencia: number) {
  return useQuery({
    queryKey: [...presupuestoProyectoKeys.detail(proyectoId), vigencia],
    queryFn:  () => getPresupuesto(proyectoId, vigencia),
    enabled:  proyectoId > 0 && vigencia > 0,
    retry: (failureCount, error: Error) =>
      !error.message.includes("404") && failureCount < 2,
  })
}

// ── useAgregarIngreso ─────────────────────────────────────────────────────
export function useAgregarIngreso(proyectoId: number, vigencia: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AgregarIngresoPayload) =>
      agregarIngreso(proyectoId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...presupuestoProyectoKeys.detail(proyectoId), vigencia],
      })
      toast.success("Línea de ingreso agregada")
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Error al agregar la línea de ingreso")
    },
  })
}

// ── useAgregarGasto ───────────────────────────────────────────────────────
export function useAgregarGasto(proyectoId: number, vigencia: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AgregarGastoPayload) =>
      agregarGasto(proyectoId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...presupuestoProyectoKeys.detail(proyectoId), vigencia],
      })
      toast.success("Línea de gasto agregada")
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Error al agregar la línea de gasto")
    },
  })
}