// =============================================================================
// Schemas Zod — espejo de FluentValidation del backend
// =============================================================================
import { z } from 'zod'

export const RegistrarModificacionSchema = z.object({
  vigencia: z
    .number({ required_error: 'La vigencia es obligatoria' })
    .int()
    .min(2020)
    .max(2099),
  unidadSolicitanteId: z
    .number({ required_error: 'La unidad solicitante es obligatoria' })
    .int()
    .positive(),
  tipoModificacion: z.enum(
    ['TRASLADO_INTERNO', 'ADICION', 'REDUCCION', 'CREDITO_ADICIONAL'],
    { required_error: 'El tipo de modificación es obligatorio' },
  ),
  justificacion: z
    .string({ required_error: 'La justificación es obligatoria' })
    .min(10, 'Mínimo 10 caracteres')
    .max(1000),
  detalleModificacion: z.string().max(2000).optional(),
  urlDocumento: z.string().url('URL inválida').optional().nullable(),
})
export type RegistrarModificacionInput = z.infer<typeof RegistrarModificacionSchema>

// Un movimiento individual por POST /lineas
export const AgregarLineaSchema = z.object({
  tipoMovimiento: z.enum(['DEBITO', 'CREDITO'], {
    required_error: 'Seleccione el tipo de movimiento',
  }),
  esIngreso: z.boolean(),
  rubroId: z
    .number({ required_error: 'El rubro es obligatorio' })
    .int()
    .positive(),
  valor: z
    .number({ required_error: 'El valor es obligatorio' })
    .positive('El valor debe ser mayor a cero'),
  descripcion: z.string().max(500).optional().nullable(),
})
export type AgregarLineaInput = z.infer<typeof AgregarLineaSchema>

// Dialog de traslado — captura el par débito+crédito en un formulario
export const AgregarTrasladoSchema = z
  .object({
    rubroOrigenId: z
      .number({ required_error: 'El rubro de origen es obligatorio' })
      .int()
      .positive(),
    rubroDestinoId: z
      .number({ required_error: 'El rubro de destino es obligatorio' })
      .int()
      .positive(),
    esIngreso: z.boolean(),
    valor: z
      .number({ required_error: 'El valor es obligatorio' })
      .positive('Debe ser mayor a cero'),
    descripcion: z.string().max(500).optional().nullable(),
  })
  .refine((d) => d.rubroOrigenId !== d.rubroDestinoId, {
    message: 'El rubro de origen y destino deben ser distintos',
    path: ['rubroDestinoId'],
  })
export type AgregarTrasladoInput = z.infer<typeof AgregarTrasladoSchema>

// Aprobar — 1ª firma (DECANO): estado PENDIENTE → APROBADA_DECANO
export const AprobarModificacionSchema = z.object({
  observaciones: z
    .string({ required_error: 'Las observaciones son obligatorias' })
    .min(5, 'Mínimo 5 caracteres')
    .max(500),
})
export type AprobarModificacionInput = z.infer<typeof AprobarModificacionSchema>

// Refrendar — 2ª firma (ADMIN_CENTRAL): estado APROBADA_DECANO → APROBADA_PLANEACION
export const RefrendarModificacionSchema = z.object({
  observaciones: z
    .string({ required_error: 'Las observaciones son obligatorias' })
    .min(5, 'Mínimo 5 caracteres')
    .max(500),
})
export type RefrendarModificacionInput = z.infer<typeof RefrendarModificacionSchema>

// Rechazar — motivoRechazo obligatorio (FE5-I3)
export const RechazarModificacionSchema = z.object({
  motivoRechazo: z
    .string({ required_error: 'El motivo de rechazo es obligatorio' })
    .min(10, 'Mínimo 10 caracteres — explique la razón del rechazo')
    .max(1000),
})
export type RechazarModificacionInput = z.infer<typeof RechazarModificacionSchema>