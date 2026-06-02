// src/features/proyectos/presupuesto/model/types.ts
// Fuente de verdad: PresupuestoProyectoResponse en ProyectoResponses.cs
// Los nombres de campo siguen la serialización camelCase de .NET System.Text.Json

export type EstadoPresupuesto =
  | "SIN_PRESUPUESTO"
  | "BORRADOR"
  | "REVISADO"
  | "APROBADO_DECANO"
  | "APROBADO_PLANEACION"
  | "CONSOLIDADO"
  | "EN_EJECUCION"

// ── Respuesta GET /api/v1/proyectos/{id}/presupuesto ───────────────────────
// Mapea exactamente PresupuestoProyectoResponse del backend:
//   TotalIngresosProy → totalIngresosProy
//   TotalGastosProy   → totalGastosProy
//   Balance           → balance  (no "diferencia")
export interface PresupuestoProyecto {
  proyectoId:        number
  vigencia:          number
  estado:            EstadoPresupuesto
  siguientePaso?:    string
  ingresos:          LineaIngreso[]
  gastos:            LineaGasto[]
  totalIngresosProy: number   // ← era totalIngresos — incorrecto
  totalGastosProy:   number   // ← era totalGastos   — incorrecto
  balance:           number   // ← era diferencia     — incorrecto
}

// ── Línea de ingreso ───────────────────────────────────────────────────────
// Mapea LineaIngresoProyectoResponse:
//   RubroIngreso                → rubroIngreso
//   NumEstudiantesProyectados   → numEstudiantesProyectados
//   ValorMatriculaUnitario      → valorMatriculaUnitario
//   SaldoPorRecaudar            → saldoPorRecaudar
export interface LineaIngreso {
  id:                         number
  rubroIngreso:               string
  fuenteRecurso:              string
  tipoMatricula?:             string
  numEstudiantesProyectados?: number
  valorMatriculaUnitario?:    number
  valorProyectado:            number
  valorDefinitivo:            number
  valorEjecutado:             number
  saldoPorRecaudar:           number
  estadoLinea:                string
  descripcion?:               string
}

// ── Línea de gasto ─────────────────────────────────────────────────────────
// Mapea LineaGastoProyectoResponse:
//   RubroGasto       → rubroGasto
//   SaldoDisponible  → saldoDisponible
export interface LineaGasto {
  id:               number
  rubroGasto:       string
  fuenteRecurso:    string
  tipoGasto:        string
  valorProyectado:  number
  valorDefinitivo:  number
  valorComprometido: number
  valorEjecutado:   number
  saldoDisponible:  number
  estadoLinea:      string
  descripcion?:     string
}

// ── Respuesta POST /consolidar ─────────────────────────────────────────────
export interface ConsolidarResponse {
  proyectoId:                  number
  vigencia:                    number
  estado:                      string
  lineasIngresosConsolidadas:  number
  lineasGastosConsolidadas:    number
  totalIngresos:               number
  totalGastos:                 number
}