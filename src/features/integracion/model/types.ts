// features/integracion/model/types.ts

export type EstadoSistema = "ACTIVO" | "INACTIVO"
export type EstadoSincronizacion = "PENDIENTE" | "EN_PROCESO" | "COMPLETADO" | "ERROR"

export interface SistemaIntegrado {
  id: number
  codigo: string
  nombre: string
  tipo: string
  urlBase: string | null
  estado: EstadoSistema
  ultimaSync: string | null
  createdAt: string
  totalRegistros: number
}

export interface SistemaIntegradoDetalle extends SistemaIntegrado {
  configJson: string | null
}

export interface Sincronizacion {
  id: number
  integracionId: number
  integracionNombre: string
  integracionCodigo: string
  unidadEjecutoraId: number | null
  unidadEjecutoraNombre: string | null
  tipoOperacion: string
  vigencia: number | null
  fechaInicio: string
  fechaFin: string | null
  registrosProcesados: number | null
  registrosError: number | null
  estado: EstadoSincronizacion
  detalleError: string | null
  urlArchivo: string | null
  iniciadoPor: string | null
  totalRegistros: number
}

export interface ExportacionResultado {
  sincronizacionId: number
  tipoOperacion: string
  estado: EstadoSincronizacion
  registrosProcesados: number | null
  urlArchivo: string | null
  mensaje: string
}

export interface EjecutarSincronizacionCommand {
  integracionId: number
  unidadEjecutoraId?: number | null
  tipoOperacion: string
  vigencia?: number | null
  iniciadoPor?: string | null
}