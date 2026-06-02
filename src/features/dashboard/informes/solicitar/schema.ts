import { z } from "zod"
import { TIPOS_INFORME } from "../../model/types"

export const solicitarInformeSchema = z.object({
  tipo: z.enum(TIPOS_INFORME, { required_error: "Seleccione un tipo de informe" }),
  vigencia: z.coerce.number().int().min(2020),
  unidadEjecutoraId: z.coerce.number().int().nullable().optional(),
  proyectoId: z.coerce.number().int().nullable().optional(),
  fechaDesde: z.string().nullable().optional(),
  fechaHasta: z.string().nullable().optional(),
})

export type SolicitarInformeForm = z.infer<typeof solicitarInformeSchema>
