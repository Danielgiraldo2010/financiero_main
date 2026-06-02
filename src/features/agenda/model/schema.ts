import { z } from "zod"

export const crearEventoSchema = z.object({
  titulo: z.string().min(1, "El titulo es obligatorio"),
  descripcion: z.string().nullable().optional(),
  tipo: z.string().min(1, "Seleccione un tipo"),
  prioridad: z.string().min(1, "Seleccione una prioridad"),
  unidadEjecutoraId: z.number().nullable().optional(),
  fechaInicio: z.string().min(1, "La fecha de inicio es obligatoria"),
  fechaFin: z.string().nullable().optional(),
  fechaLimite: z.string().nullable().optional(),
  esRecurrente: z.coerce.boolean(),
  patronRecurrencia: z.string().nullable().optional(),
  entidadOrigenTipo: z.string().nullable().optional(),
  entidadOrigenId: z.number().nullable().optional(),
})

export type CrearEventoForm = z.infer<typeof crearEventoSchema>

export const actualizarEventoSchema = crearEventoSchema

export type ActualizarEventoForm = z.infer<typeof actualizarEventoSchema>

export const completarEventoSchema = z.object({
  observacion: z.string().nullable().optional(),
})
export type CompletarEventoForm = z.infer<typeof completarEventoSchema>

export const cancelarEventoSchema = z.object({
  motivo: z.string().min(1, "El motivo es obligatorio"),
})
export type CancelarEventoForm = z.infer<typeof cancelarEventoSchema>

export const agregarAsignacionSchema = z.object({
  usuarioId: z.string().optional(),
  rolDestino: z.string().min(1, "Seleccione un rol"),
})
export type AgregarAsignacionForm = z.infer<typeof agregarAsignacionSchema>
