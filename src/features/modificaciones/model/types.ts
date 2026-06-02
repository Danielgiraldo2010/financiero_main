// =============================================================================
// Modificaciones Presupuestales — Tipos de dominio
// IMPORTANTE: EstadoModificacion usa los valores EXACTOS que devuelve el backend
// (sp_SolicitarModificacionPresupuestal / RegistrarModificacionHandler.cs):
//   PENDIENTE · APROBADA_DECANO · APROBADA_PLANEACION · RECHAZADA
// El campo siguienteAccion del handler confirma estos valores.
// =============================================================================

export type EstadoModificacion =
  | 'PENDIENTE'
  | 'APROBADA_DECANO'
  | 'APROBADA_PLANEACION'
  | 'RECHAZADA'

export type TipoModificacion =
  | 'TRASLADO_INTERNO'
  | 'ADICION'
  | 'REDUCCION'
  | 'CREDITO_ADICIONAL'

export type TipoMovimiento = 'DEBITO' | 'CREDITO'

// ----- DetalleModificacionResponse ----------------------------------------
export interface LineaModificacion {
  id: number
  tipoMovimiento: TipoMovimiento
  esIngreso: boolean
  rubro: string
  valor: number
  descripcion: string | null
}

// ----- SolicitudModificacionResponse (detalle completo) -------------------
export interface SolicitudModificacion {
  id: number
  numeroSolicitud: string
  fechaSolicitud: string       // 'YYYY-MM-DD'
  vigencia: number
  tipoModificacion: TipoModificacion
  unidadSolicitanteId: number
  unidadSolicitante: string
  justificacion: string
  estado: EstadoModificacion
  usuarioAprueba: string | null
  fechaAprobacion: string | null
  observaciones: string | null
  urlDocumento: string | null
  siguienteAccion: string
  detalle: LineaModificacion[]
}

// ----- Resumen para listado paginado ---------------------------------------
export interface SolicitudModificacionResumen {
  id: number
  numeroSolicitud: string
  fechaSolicitud: string
  vigencia: number
  tipoModificacion: TipoModificacion
  unidadSolicitante: string
  estado: EstadoModificacion
  siguienteAccion: string
}

// ----- Evento de timeline --------------------------------------------------
export interface TimelineEvento {
  id: number
  estado: EstadoModificacion
  actor: string
  fecha: string
  observaciones: string | null
}

// ----- Filtros de listado --------------------------------------------------
export interface ModificacionesParams {
  vigencia?: number
  estado?: EstadoModificacion
  pagina?: number
  tamanoPagina?: number
}