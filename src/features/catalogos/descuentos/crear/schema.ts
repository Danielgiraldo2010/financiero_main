import { z } from "zod"
export const crearDescuentoSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  descripcion: z.string().nullable().optional(),
  porcentaje: z.coerce.number().min(0).max(100, "Porcentaje entre 0 y 100"),
})
export type CrearDescuentoForm = z.infer<typeof crearDescuentoSchema>