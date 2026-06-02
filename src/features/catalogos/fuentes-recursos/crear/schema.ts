import { z } from "zod"

export const crearFuenteSchema = z.object({
  codigo: z.string().min(1, "El codigo es requerido"),
  nombre: z.string().min(1, "El nombre es requerido"),
  tipo: z.string().min(1, "El tipo es requerido"),
  descripcion: z.string().nullable().optional(),
})

export type CrearFuenteForm = z.infer<typeof crearFuenteSchema>
