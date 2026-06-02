import { z } from 'zod'

const porc = z.number({ required_error: 'Requerido' })
  .min(0, 'Mínimo 0').max(100, 'Máximo 100')

export const CargarCostosSchema = z.object({
  vigencia:             z.number({ required_error: 'Requerido' }).int().min(2000),
  mes:                  z.number({ required_error: 'Requerido' }).int().min(1).max(12),
  tipoNomina:           z.string().min(1, 'Requerido'),
  porcSaludEmpleador:   porc,
  porcPensionEmpleador: porc,
  porcArl:              porc,
  porcCajaCompensacion: porc,
  porcIcbf:             porc,
  porcSena:             porc,
  factorPrestaciones:   z.number({ required_error: 'Requerido' }).min(1),
})

export type CargarCostosFormValues = z.infer<typeof CargarCostosSchema>
