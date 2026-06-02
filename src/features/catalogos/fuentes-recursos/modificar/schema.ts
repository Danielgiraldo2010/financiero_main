import { z } from "zod"
export const modificarFuenteSchema = z.object({
  codigo: z.string().min(1, "El codigo es requerido"),
  nombre: z.string().min(1, "El nombre es requerido"),
  tipo: z.string().min(1, "El tipo es requerido"),
  descripcion: z.string().nullable().optional(),
})
export type ModificarFuenteForm = z.infer<typeof modificarFuenteSchema>