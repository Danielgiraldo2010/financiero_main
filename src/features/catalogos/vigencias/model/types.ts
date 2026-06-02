// features/catalogos/vigencias/model/types.ts

export interface VigenciaResponse {
  id: number
  anio: number
  descripcion: string | null
  fechaInicio: string
  fechaFin: string
  estado: string
  numeroAcuerdoAprobacion: string | null
  fechaAprobacion: string | null
  createdBy: string | null
  createdAt: string
  updatedAt: string
}

export interface VigenciaUeResponse {
  id: number
  vigenciaId: number
  anio: number
  unidadEjecutoraId: number
  unidadEjecutoraNombre: string
  techoComunicado: number | null
  fechaComunicacion: string | null
  urlComunicacion: string | null
  estado: string
  permiteEjecucion: boolean
  habilitadaPor: string | null
  fechaHabilitacion: string | null
  observaciones: string | null
  resolucionLiquidacion: string | null
  fechaLiquidacion: string | null
  urlResolucion: string | null
  observacionesDevolucion: string | null
  createdAt: string
  updatedAt: string
}

export interface CrearVigenciaCommand {
  anio: number
  descripcion: string | null
  fechaInicio: string
  fechaFin: string
}

export interface CambiarEstadoVigenciaRequest {
  nuevoEstado: string
  numeroAcuerdoAprobacion?: string | null
  fechaAprobacion?: string | null
}

export interface HabilitarUnidadRequest {
  unidadEjecutoraId: number
  techoComunicado?: number | null
  fechaComunicacion?: string | null
  urlComunicacion?: string | null
  observaciones?: string | null
}

export interface CambiarEstadoUeRequest {
  nuevoEstado: string
  resolucionLiquidacion?: string | null
  fechaLiquidacion?: string | null
  urlResolucion?: string | null
  observacionesDevolucion?: string | null
}

export type EstadoVigencia =
  | 'CONFIGURACION'
  | 'EN_ELABORACION'
  | 'APROBADA'
  | 'EN_EJECUCION'
  | 'CERRADA'

export type EstadoVigenciaUe =
  | 'PENDIENTE'
  | 'HABILITADA'
  | 'EN_ELABORACION'
  | 'ENVIADA'
  | 'DEVUELTA'
  | 'LIQUIDADA'
  | 'CERRADA'
