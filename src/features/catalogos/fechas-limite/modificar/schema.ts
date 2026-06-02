import { z } from "zod"
export const modificarFechaLimiteSchema = z.object({
  tipoLimite: z.string().min(1, "El tipo de limite es requerido"),
  nombre: z.string().min(1, "El nombre es requerido"),
  fechaLimite: z.string().min(1, "La fecha limite es requerida"),
  fechaRecordatorio: z.string().nullable().optional(),
  diasAnticipacion: z.coerce.number().int().nullable().optional(),
  descripcion: z.string().nullable().optional(),
  unidadEjecutoraId: z.coerce.number().int().nullable().optional(),
})
export type ModificarFechaLimiteForm = z.infer<typeof modificarFechaLimiteSchema>