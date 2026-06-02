// src/features/proyectos/cartera/model/schema.ts
import { z } from 'zod'

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)')

const currentYear = new Date().getFullYear()

export const RegistrarFacturaSchema = z
  .object({
    numeroFactura:     z.string().min(1, 'El número de factura es obligatorio').max(50),
    vigencia:          z.number().int().min(1900).max(currentYear + 1),
    unidadEjecutoraId: z.number().int().positive(),
    proyectoId:        z.number().int().positive().optional(),
    contratoId:        z.number().int().positive().optional(),
    clienteNombre:     z.string().min(2, 'Ingrese el nombre del cliente').max(200),
    clienteNit:        z.string().max(20).optional(),
    concepto:          z.string().min(5, 'Describa el concepto').max(500),
    rubroIngresoId:    z.number().int().positive('Seleccione el rubro de ingreso'),
    valorFactura:      z.number({ required_error: 'Ingrese el valor de la factura' }).positive(),
    fechaFactura:      dateString,
    fechaVencimiento:  dateString,
    urlDocumento:      z.string().url('URL inválida').optional().or(z.literal('')),
  })
  .superRefine((val, ctx) => {
    if (val.fechaFactura && val.fechaVencimiento && val.fechaFactura > val.fechaVencimiento) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['fechaVencimiento'],
        message: 'La fecha de vencimiento debe ser posterior a la fecha de factura',
      })
    }
  })

export type RegistrarFacturaForm = z.infer<typeof RegistrarFacturaSchema>