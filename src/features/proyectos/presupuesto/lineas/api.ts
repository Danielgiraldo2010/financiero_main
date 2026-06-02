// src/features/proyectos/presupuesto/lineas/api.ts
// GET  /api/v1/proyectos/{id}/presupuesto?vigencia={vigencia}
// POST /api/v1/proyectos/{id}/presupuesto/ingresos
// POST /api/v1/proyectos/{id}/presupuesto/gastos

import { fetcher } from "@/shared/api/fetcher"
import type { PresupuestoProyecto, LineaIngreso, LineaGasto } from "../model/types"

// ── GET presupuesto completo ───────────────────────────────────────────────
// vigencia es requerido por el backend — sin él retorna 500
export async function getPresupuesto(
  proyectoId: number,
  vigencia: number,
): Promise<PresupuestoProyecto> {
  return fetcher<PresupuestoProyecto>(
    `/api/v1/proyectos/${proyectoId}/presupuesto?vigencia=${vigencia}`,
  )
}

// ── Agregar línea de ingreso ───────────────────────────────────────────────
export interface AgregarIngresoPayload {
  Vigencia: number
  RubroIngresoId: number
  FuenteRecursoId: number
  TipoMatricula: string
  NumEstudiantesProyectados: number
  ValorMatriculaUnitario: number
  ValorProyectado: number
  Descripcion?: string
}

export async function agregarIngreso(
  proyectoId: number,
  payload: AgregarIngresoPayload,
): Promise<LineaIngreso> {
  return fetcher<LineaIngreso>(
    `/api/v1/proyectos/${proyectoId}/presupuesto/ingresos`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  )
}

// ── Agregar línea de gasto ─────────────────────────────────────────────────
export interface AgregarGastoPayload {
  Vigencia: number
  RubroGastoId: number
  FuenteRecursoId: number
  TipoGasto: string
  ValorProyectado: number
  Descripcion?: string
}

export async function agregarGasto(
  proyectoId: number,
  payload: AgregarGastoPayload,
): Promise<LineaGasto> {
  return fetcher<LineaGasto>(
    `/api/v1/proyectos/${proyectoId}/presupuesto/gastos`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  )
}