// src/features/proyectos/contratos/model/schema.ts
import { z } from 'zod'

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)')

// ─── Registrar contrato ───────────────────────────────────────────────────────

export const RegistrarContratoSchema = z
  .object({
    proyectoId:        z.number().int().positive('Seleccione el proyecto'),
    unidadEjecutoraId: z.number().int().positive(),
    numeroContrato:    z.string().min(1, 'El número de contrato es obligatorio').max(50),
    contratista:       z.string().min(2, 'Ingrese el nombre del contratista').max(200),
    nitCedula:         z.string().max(20).optional(),
    objetoContrato:    z.string().min(5, 'Describa el objeto del contrato').max(500),
    valorTotal:        z.number({ required_error: 'Ingrese el valor total' }).positive(),
    rubroGastoId:      z.number().int().positive('Seleccione el rubro de gasto'),
    fuenteRecursoId:   z.number().int().positive('Seleccione la fuente de recurso'),
    fechaInicio:       dateString,
    fechaFin:          dateString,
    supervisor:        z.string().max(200).optional(),
    urlDocumento:      z.string().url('URL inválida').optional().or(z.literal('')),
  })
  .superRefine((val, ctx) => {
    if (val.fechaInicio && val.fechaFin && val.fechaInicio > val.fechaFin) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['fechaFin'],
        message: 'La fecha de fin debe ser posterior a la fecha de inicio',
      })
    }
  })

export type RegistrarContratoForm = z.infer<typeof RegistrarContratoSchema>

// ─── Registrar pago ───────────────────────────────────────────────────────────

export const RegistrarPagoSchema = z.object({
  numeroPago:    z.string().min(1, 'Ingrese el número de pago').max(50),
  fechaPago:     dateString,
  valor:         z.number({ required_error: 'Ingrese el valor del pago' }).positive(),
  comprobante:   z.string().max(100).optional(),
  urlSoporte:    z.string().url('URL inválida').optional().or(z.literal('')),
  observaciones: z.string().max(500).optional(),
})

export type RegistrarPagoForm = z.infer<typeof RegistrarPagoSchema>