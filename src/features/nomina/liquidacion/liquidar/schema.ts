import { z } from 'zod'

export const LiquidarNominaSchema = z.object({
  empleadoId:    z.number({ required_error: 'Selecciona un empleado' }).int().positive(),
  vigencia:      z.number({ required_error: 'Requerido' }).int().min(2000).max(2100),
  mes:           z.number({ required_error: 'Requerido' }).int().min(1).max(12),
  diasLaborados: z.number({ required_error: 'Requerido' }).int().min(1).max(31),
})

export type LiquidarNominaFormValues = z.infer<typeof LiquidarNominaSchema>
