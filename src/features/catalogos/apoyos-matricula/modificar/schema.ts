import { z } from "zod"
export const modificarApoyoSchema = z.object({
  codigo: z.string().min(1, "El codigo es requerido"),
  nombre: z.string().min(1, "El nombre es requerido"),
  tipo: z.string().min(1, "El tipo es requerido"),
  rubroIngresoId: z.coerce.number().int().min(1, "El rubro de ingreso es requerido"),
})
export type ModificarApoyoForm = z.infer<typeof modificarApoyoSchema>