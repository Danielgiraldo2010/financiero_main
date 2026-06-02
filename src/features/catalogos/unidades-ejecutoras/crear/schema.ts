import { z } from "zod"

export const crearUESchema = z.object({
  codigo: z.string().min(1, "El codigo es requerido"),
  nombre: z.string().min(1, "El nombre es requerido"),
  nivel: z.coerce.number().int().min(1),
  padreId: z.coerce.number().int().nullable().optional(),
})

export type CrearUEForm = z.infer<typeof crearUESchema>
