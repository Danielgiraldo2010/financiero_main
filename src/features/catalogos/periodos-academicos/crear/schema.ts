import { z } from "zod"

export const crearPeriodoSchema = z.object({
  vigencia: z.coerce.number().int().min(2020, "Vigencia minima 2020"),
  periodo: z.coerce.number().int().min(1).max(2, "Solo periodo 1 o 2"),
  nombre: z.string().min(1, "El nombre es requerido"),
  fechaInicio: z.string().min(1, "La fecha de inicio es requerida"),
  fechaFin: z.string().min(1, "La fecha de fin es requerida"),
})

export type CrearPeriodoForm = z.infer<typeof crearPeriodoSchema>
