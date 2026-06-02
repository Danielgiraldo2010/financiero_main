import { z } from "zod"
export const modificarProgramaSchema = z.object({
  codigo: z.string().min(1, "El codigo es requerido"),
  nombre: z.string().min(1, "El nombre es requerido"),
  nivel: z.string().min(1, "El nivel es requerido"),
  facultadId: z.coerce.number().int().min(1, "La facultad es requerida"),
})
export type ModificarProgramaForm = z.infer<typeof modificarProgramaSchema>