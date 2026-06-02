import { z } from 'zod'

// NOTA: el plan original describía un schema discriminado por normaLiquidacion
// con factorPrestaciones condicional. El RegistrarPlanClasesCommand real
// NO tiene ese campo — se usa schema plano.
export const RegistrarPlanClasesSchema = z.object({
  empleadoId: z.number({
    required_error: 'Selecciona un empleado',
  }).int().positive(),

  periodoAcademicoId: z.number({
    required_error: 'Selecciona un período académico',
  }).int().positive(),

  programaAcademicoId: z.number({
    required_error: 'Selecciona un programa',
  }).int().positive(),

  asignatura:       z.string().min(1, 'Requerido'),
  codigoAsignatura: z.string().nullable().optional(),
  grupo:            z.string().nullable().optional(),

  horasSemanales: z.number({
    required_error: 'Requerido',
  }).int().min(1, 'Mínimo 1 hora').max(40, 'Máximo 40 horas'),

  semanas: z.number({
    required_error: 'Requerido',
  }).int().min(1, 'Mínimo 1 semana').max(20, 'Máximo 20 semanas'),

  normaLiquidacion: z.string().min(1, 'Selecciona una norma'),

  puntosSalarialesId: z.number().int().positive().nullable().optional(),

  observaciones: z.string().nullable().optional(),
})

export type RegistrarPlanClasesFormValues = z.infer<typeof RegistrarPlanClasesSchema>
