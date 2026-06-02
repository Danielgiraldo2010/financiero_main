import { z } from "zod"

export const crearRubroIngresoSchema = z.object({
  codigoCicp: z.string().min(1, "El codigo CICP es requerido"),
  nombre: z.string().min(1, "El nombre es requerido"),
  categoria: z.string().min(1, "La categoria es requerida"),
  subcategoria: z.string().nullable().optional(),
  estructuraId: z.coerce.number().int().nullable().optional(),
})

export type CrearRubroIngresoForm = z.infer<typeof crearRubroIngresoSchema>
