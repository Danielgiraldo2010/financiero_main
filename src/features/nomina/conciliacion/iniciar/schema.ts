import { z } from 'zod'

export const IniciarConciliacionSchema = z.object({
  vigencia:          z.number({ required_error: 'Requerido' }).int().min(2000),
  mes:               z.number({ required_error: 'Requerido' }).int().min(1).max(12),
  proyectoId:        z.number({ required_error: 'Requerido' }).int().positive(),
  unidadEjecutoraId: z.number({ required_error: 'Requerido' }).int().positive(),
})

export type IniciarConciliacionFormValues = z.infer<typeof IniciarConciliacionSchema>
