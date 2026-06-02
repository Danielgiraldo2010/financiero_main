import { z } from "zod"

export const crearNormaSchema = z.object({
  codigo: z.string().min(1, "El codigo es obligatorio"),
  tipo: z.string().min(1, "Seleccione un tipo"),
  ambito: z.string().min(1, "Seleccione un ambito"),
  titulo: z.string().min(1, "El titulo es obligatorio"),
  descripcion: z.string().nullable().optional(),
  entidadEmisora: z.string().nullable().optional(),
  fechaExpedicion: z.string().nullable().optional(),
  fechaVigenciaDesde: z.string().nullable().optional(),
  fechaVigenciaHasta: z.string().nullable().optional(),
  urlDocumento: z.string().url("URL invalida").nullable().optional().or(z.literal("")),
})

export type CrearNormaForm = z.infer<typeof crearNormaSchema>

export const actualizarNormaSchema = crearNormaSchema
export type ActualizarNormaForm = z.infer<typeof actualizarNormaSchema>

export const derogarNormaSchema = z.object({
  confirmacion: z.string().min(1, "Debe escribir DEROGAR para confirmar"),
})
export type DerogarNormaForm = z.infer<typeof derogarNormaSchema>

export const agregarProcesoSchema = z.object({
  dominio: z.string().min(1, "Seleccione un dominio"),
  descripcionAplicacion: z.string().optional(),
})
export type AgregarProcesoForm = z.infer<typeof agregarProcesoSchema>
