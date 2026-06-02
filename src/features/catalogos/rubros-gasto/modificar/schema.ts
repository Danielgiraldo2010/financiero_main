import { z } from "zod"
export const modificarRubroGastoSchema = z.object({
  codigoCcp: z.string().min(1, "El codigo CCP es requerido"),
  nombre: z.string().min(1, "El nombre es requerido"),
  tipoGasto: z.string().min(1, "El tipo de gasto es requerido"),
  clasificacionFunc: z.string().min(1, "La clasificacion funcional es requerida"),
  estructuraId: z.coerce.number().int().nullable().optional(),
})
export type ModificarRubroGastoForm = z.infer<typeof modificarRubroGastoSchema>