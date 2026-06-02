import { z } from 'zod'

export const ConfirmarPagoSchema = z.object({
  fechaPago:       z.string().min(1, 'Requerido'),
  comprobantePago: z.string().nullable().optional(),
  urlSoporte:      z.string().url('URL inválida').nullable().optional(),
  ordenPagoId:     z.number().int().positive().nullable().optional(),
  observaciones:   z.string().nullable().optional(),
})

export type ConfirmarPagoFormValues = z.infer<typeof ConfirmarPagoSchema>
