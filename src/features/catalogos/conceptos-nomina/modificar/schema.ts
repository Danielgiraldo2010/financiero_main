import { z } from "zod"
export const modificarConceptoSchema = z.object({
  codigo: z.string().min(1, "El codigo es requerido"),
  nombre: z.string().min(1, "El nombre es requerido"),
  tipo: z.string().min(1, "El tipo es requerido"),
  rubroGastoId: z.coerce.number().int().nullable().optional(),
  esFactorSalarial: z.coerce.boolean(),
  porcentajeAplicacion: z.coerce.number().nullable().optional(),
  orden: z.coerce.number().int().min(1),
})
export type ModificarConceptoForm = z.infer<typeof modificarConceptoSchema>