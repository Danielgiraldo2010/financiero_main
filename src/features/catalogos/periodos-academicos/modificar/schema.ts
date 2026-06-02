import { z } from "zod"
export const modificarPeriodoSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  fechaInicio: z.string().min(1, "La fecha de inicio es requerida"),
  fechaFin: z.string().min(1, "La fecha de fin es requerida"),
})
export type ModificarPeriodoForm = z.infer<typeof modificarPeriodoSchema>