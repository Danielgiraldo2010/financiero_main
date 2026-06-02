// src\features\proyectos\model\schema.ts
import { z } from 'zod'

const currentYear = new Date().getFullYear()

// ─── Schema base compartido ───────────────────────────────────────────────────
const baseSchema = z.object({
  Codigo:             z.string().min(1, 'El código es obligatorio').max(50),
  Nombre:             z.string().min(3, 'Mínimo 3 caracteres').max(200),
  UnidadEjecutoraId:  z.number({ required_error: 'Seleccione la UE' }).int().positive(),
  TipoProyectoId:     z.number({ required_error: 'Seleccione el tipo' }).int().positive(),
  ProgramaAcademicoId: z.number().int().positive().optional(),
  ValorTotal:         z.number({ required_error: 'Ingrese el valor total' }).positive(),
  FechaInicio:        z.string().optional(),
  FechaFin:           z.string().optional(),
  VigenciaActiva:     z
    .number({ required_error: 'Ingrese la vigencia' })
    .int()
    .min(1900)
    .max(currentYear + 1, `La vigencia no puede superar ${currentYear + 1}`),
  // Flag derivado del TipoProyecto — guía validación condicional, no se envía al backend
  _habilitaMatriculas: z.boolean().optional(),
})

export const RegistrarProyectoSchema = baseSchema.superRefine((val, ctx) => {
  if (val._habilitaMatriculas === true && !val.ProgramaAcademicoId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['ProgramaAcademicoId'],
      message: 'El programa académico es obligatorio para este tipo de proyecto',
    })
  }
  if (val.FechaInicio && val.FechaFin && val.FechaInicio > val.FechaFin) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['FechaFin'],
      message: 'La fecha de fin debe ser posterior a la fecha de inicio',
    })
  }
})

export type RegistrarProyectoForm = z.infer<typeof RegistrarProyectoSchema>

// ─── Modificar (solo campos editables) ───────────────────────────────────────
export const ModificarProyectoSchema = z.object({
  Nombre:      z.string().min(3).max(200),
  ValorTotal:  z.number().positive(),
  FechaInicio: z.string().optional(),
  FechaFin:    z.string().optional(),
})

export type ModificarProyectoForm = z.infer<typeof ModificarProyectoSchema>