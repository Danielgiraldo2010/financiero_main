// lineas/schema.ts
// Esquemas Zod para agregar líneas de ingreso y gasto.
// Espejo de FluentValidation del backend (AgregarIngresoCommand / AgregarGastoCommand).

import { z } from "zod"

// ── Línea de Ingreso ───────────────────────────────────────────────────────
export const AgregarLineaIngresoSchema = z.object({
  Vigencia: z
    .number({ required_error: "La vigencia es requerida" })
    .int()
    .min(1900)
    .max(new Date().getFullYear()),
  RubroIngresoId: z
    .number({ required_error: "Seleccione un rubro de ingreso" })
    .int()
    .positive(),
  FuenteRecursoId: z
    .number({ required_error: "Seleccione una fuente de recurso" })
    .int()
    .positive(),
  TipoMatricula: z
    .string({ required_error: "El tipo de matrícula es requerido" })
    .min(1),
  NumEstudiantesProyectados: z
    .number({ required_error: "Ingrese el número de estudiantes proyectados" })
    .int()
    .min(1),
  ValorMatriculaUnitario: z
    .number({ required_error: "Ingrese el valor de matrícula unitario" })
    .min(0),
  ValorProyectado: z
    .number({ required_error: "El valor proyectado es requerido" })
    .min(1, "El valor proyectado debe ser mayor a 0"),
  Descripcion: z.string().max(500).optional(),
})

export type AgregarLineaIngresoInput = z.infer<typeof AgregarLineaIngresoSchema>

// ── Línea de Gasto ─────────────────────────────────────────────────────────
export const AgregarLineaGastoSchema = z.object({
  Vigencia: z
    .number({ required_error: "La vigencia es requerida" })
    .int()
    .min(1900)
    .max(new Date().getFullYear()),
  RubroGastoId: z
    .number({ required_error: "Seleccione un rubro de gasto" })
    .int()
    .positive(),
  FuenteRecursoId: z
    .number({ required_error: "Seleccione una fuente de recurso" })
    .int()
    .positive(),
  TipoGasto: z
    .string({ required_error: "El tipo de gasto es requerido" })
    .min(1),
  ValorProyectado: z
    .number({ required_error: "El valor proyectado es requerido" })
    .min(1, "El valor proyectado debe ser mayor a 0"),
  Descripcion: z.string().max(500).optional(),
})

export type AgregarLineaGastoInput = z.infer<typeof AgregarLineaGastoSchema>
