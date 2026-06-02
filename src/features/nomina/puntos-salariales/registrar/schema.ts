import { z } from 'zod'

export const RegistrarPuntosSchema = z.object({
  vigencia:        z.number({ required_error: 'Requerido' }).int().min(2000).max(2100),
  decretoNorma:    z.string().min(1, 'Requerido'),
  categoria:       z.string().min(1, 'Requerido'),
  nivel:           z.number({ required_error: 'Requerido' }).int().min(1),
  puntosBase:      z.number({ required_error: 'Requerido' }).positive(),
  valorPunto:      z.number({ required_error: 'Requerido' }).positive(),
  factorCategoria: z.number({ required_error: 'Requerido' }).positive(),
  vigenteDesde:    z.string().min(1, 'Requerido'),
  vigenteHasta:    z.string().nullable().optional(),
})

export type RegistrarPuntosFormValues = z.infer<typeof RegistrarPuntosSchema>
