import { z } from 'zod'

export const RegistrarHorasSchema = z.object({
  planClasesId: z.number({
    required_error: 'Requerido',
  }).int().positive(),

  mes: z.number({
    required_error: 'Requerido',
  }).int().min(1, 'Mín. enero (1)').max(12, 'Máx. diciembre (12)'),

  horasProyectadas: z.number({
    required_error: 'Requerido',
  }).nonnegative(),

  horasReales: z.number({
    required_error: 'Requerido',
  }).nonnegative(),

  justificacion: z.string().nullable().optional(),
})

export type RegistrarHorasFormValues = z.infer<typeof RegistrarHorasSchema>
