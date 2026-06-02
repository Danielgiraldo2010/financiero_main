import { z } from "zod"
import { MUNICIPIO_MANIZALES_ID } from "./constants"

// ─── Cohorte ──────────────────────────────────────────────────────────────────
export const RegistrarCohorteSchema = z.object({
  vigencia:                    z.number().int().min(2020).max(2099),
  periodo:                     z.string().min(1),
  programaAcademicoId:         z.number().int().positive(),
  unidadEjecutoraId:           z.number().int().positive(),
  municipioId:                 z.number().int().positive().nullable().optional(),
  cohorte:                     z.number().int().min(1).max(99),
  numeroEstudiantes:           z.number().int().min(1),
  valorMatriculaBase:          z.number().positive(),
  tipoMatricula:               z.string().min(1),
  rubroIngresoId:              z.number().int().positive(),
  fuenteRecursoId:             z.number().int().positive(),
  porcentajeDescuentoVotacion: z.number().min(0).max(100).default(0),
  porcentajeOtrosDescuentos:   z.number().min(0).max(100).default(0),
  porcentajeDescuentoGratuidad:z.number().min(0).max(100).default(0),
  transferenciaInternaId:      z.number().int().positive().nullable().optional(),
  coberturaPickId:             z.number().int().positive().nullable().optional(),
  descripcion:                 z.string().nullable().optional(),
})

// FormValues = tipo que ve el formulario (pre-transform, con undefined)
export type RegistrarCohorteFormValues = z.input<typeof RegistrarCohorteSchema>
// CommandValues = tipo que va a la API (post-transform, sin undefined)
export type RegistrarCohorteCommandValues = z.output<typeof RegistrarCohorteSchema>

// ─── Transferencia Interna ────────────────────────────────────────────────────
export const RegistrarTransferenciaSchema = z.object({
  vigencia:                  z.number().int().min(2020),
  periodo:                   z.string().min(1),
  unidadEjecutoraDestinoId:  z.number().int().positive(),
  proyectoId:                z.number().int().positive().nullable().optional(),
  tipoTransferencia:         z.string().min(1),
  vicerrectoriaOrigen:       z.string().min(1),
  valor:                     z.number().positive(),
  numeroActoAdministrativo:  z.string().nullable().optional(),
  fechaActo:                 z.string().nullable().optional(),
  observaciones:             z.string().nullable().optional(),
  urlSoporte:                z.string().url().nullable().optional(),
})

export type RegistrarTransferenciaFormValues   = z.input<typeof RegistrarTransferenciaSchema>
export type RegistrarTransferenciaCommandValues = z.output<typeof RegistrarTransferenciaSchema>

// ─── Confirmar Recepción ──────────────────────────────────────────────────────
export const ConfirmarRecepcionSchema = z.object({
  id:            z.number().int().positive(),
  valorRecibido: z.number().positive(),
  fechaGiro:     z.string().min(1, "La fecha de giro es requerida"),
  observaciones: z.string().nullable().optional(),
})

export type ConfirmarRecepcionFormValues    = z.input<typeof ConfirmarRecepcionSchema>
export type ConfirmarRecepcionCommandValues = z.output<typeof ConfirmarRecepcionSchema>

// ─── Cobertura PIC ────────────────────────────────────────────────────────────
export const RegistrarCoberturaSchema = z.object({
  vigencia:                   z.number().int().min(2020),
  periodo:                    z.string().min(1),
  programaAcademicoId:        z.number().int().positive(),
  municipioId:                z
    .number()
    .int()
    .positive()
    .refine(
      (v) => v !== MUNICIPIO_MANIZALES_ID,
      {
        message:
          "La cobertura PIC aplica únicamente para municipios distintos a Manizales. " +
          "Para estudiantes de Manizales use el tipo de matrícula correspondiente.",
      }
    ),
  numEstudiantesBeneficiarios: z.number().int().min(1),
  valorMatriculaBase:          z.number().positive(),
  porcentajeCobertura:         z.number().min(1).max(100).default(50),
})

export type RegistrarCoberturaFormValues    = z.input<typeof RegistrarCoberturaSchema>
export type RegistrarCoberturaCommandValues = z.output<typeof RegistrarCoberturaSchema>

// ─── Confirmar Giro ───────────────────────────────────────────────────────────
export const ConfirmarGiroSchema = z.object({
  id:         z.number().int().positive(),
  fechaGiro:  z.string().min(1),
  urlSoporte: z.string().url().nullable().optional(),
})

export type ConfirmarGiroFormValues    = z.input<typeof ConfirmarGiroSchema>
export type ConfirmarGiroCommandValues = z.output<typeof ConfirmarGiroSchema>

// ─── Becas Posgrado ───────────────────────────────────────────────────────────
export const RegistrarBecaSchema = z.object({
  vigencia:                z.number().int().min(2020),
  convocatoriaMinciencias: z.string().min(1, "La convocatoria Minciencias es requerida"),
  tipoBeca:                z.string().min(1),
  programaAcademicoId:     z.number().int().positive(),
  unidadEjecutoraId:       z.number().int().positive(),
  numBeneficiarios:        z.number().int().min(1),
  valorPorBeca:            z.number().positive(),
  urlResolucion:           z.string().url().nullable().optional(),
})

export type RegistrarBecaFormValues    = z.input<typeof RegistrarBecaSchema>
export type RegistrarBecaCommandValues = z.output<typeof RegistrarBecaSchema>

// ─── Transferencia Beca ───────────────────────────────────────────────────────
export const RegistrarTransferenciaBecaSchema = z.object({
  id:                       z.number().int().positive(),
  fechaResolucionMinisterio: z.string().min(1),
  fechaGiroMinisterio:      z.string().min(1),
  fechaTransferenciaUe:     z.string().min(1),
})

export type RegistrarTransferenciaBecaFormValues = z.input<typeof RegistrarTransferenciaBecaSchema>