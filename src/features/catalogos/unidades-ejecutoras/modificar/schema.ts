import { z } from "zod"

export const modificarUESchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  nivel: z.coerce.number().int().min(1).nullable().optional(),
})

export type ModificarUEForm = z.infer<typeof modificarUESchema>
