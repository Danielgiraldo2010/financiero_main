export interface MiAgendaItemResponse {
  eventoId: number
  titulo: string
  descripcion: string | null
  tipo: string
  prioridad: string
  fechaInicio: string
  fechaFin: string | null
  fechaLimite: string | null
  estado: EstadoEvento
  entidadOrigenTipo: string | null
  entidadOrigenId: number | null
  asignacionId: number
  visto: boolean
  fechaVisto: string | null
  totalRegistros: number
}

export interface AgendaEventoResponse {
  id: number
  titulo: string
  descripcion: string | null
  tipo: string
  prioridad: string
  unidadEjecutoraId: number | null
  unidadEjecutoraNombre: string | null
  fechaInicio: string
  fechaFin: string | null
  fechaLimite: string | null
  esRecurrente: boolean
  patronRecurrencia: string | null
  entidadOrigenTipo: string | null
  entidadOrigenId: number | null
  estado: EstadoEvento
  creadoPor: string | null
  createdAt: string
  updatedAt: string
  totalRegistros: number
}

export interface AgendaAsignacionResponse {
  id: number
  eventoId: number
  eventoTitulo: string
  usuarioId: string | null
  rolDestino: string | null
  notificado: boolean
  fechaNotif: string | null
  visto: boolean
  fechaVisto: string | null
  totalRegistros: number
}

export interface CrearEventoCommand {
  titulo: string
  descripcion?: string | null
  tipo: string
  prioridad: string
  unidadEjecutoraId?: number | null
  fechaInicio: string
  fechaFin?: string | null
  fechaLimite?: string | null
  esRecurrente: boolean
  patronRecurrencia?: string | null
  entidadOrigenTipo?: string | null
  entidadOrigenId?: number | null
  creadoPor?: string | null
  asignaciones?: CrearAsignacionDto[] | null
}

export interface ActualizarEventoRequest {
  titulo: string
  descripcion?: string | null
  tipo: string
  prioridad: string
  unidadEjecutoraId?: number | null
  fechaInicio: string
  fechaFin?: string | null
  fechaLimite?: string | null
  esRecurrente: boolean
  patronRecurrencia?: string | null
  entidadOrigenTipo?: string | null
  entidadOrigenId?: number | null
}

export interface CrearAsignacionDto {
  usuarioId?: string | null
  rolDestino?: string | null
}

export interface AgregarAsignacionRequest {
  usuarioId?: string | null
  rolDestino?: string | null
}

export interface CompletarEventoRequest {
  observacion?: string | null
}

export interface CancelarEventoRequest {
  motivo?: string | null
}
// Agregar a src/features/agenda/model/types.ts

export interface MiAgendaParams {
  usuarioId: string          // Guid del usuario autenticado — obligatorio
  pagina?: number
  elementosPorPagina?: number
  rol?: string               // rol del usuario en la UE activa
  unidadEjecutoraId?: number
  estado?: string
  fechaDesde?: string
  fechaHasta?: string
}

// PagedResult<T> — agregar si no existe ya en el proyecto:
export interface PagedResult<T> {
  items: T[]
  totalItems: number
  pagina: number
  tamanoPagina: number
  totalPaginas: number
}

export type EstadoEvento = "PENDIENTE" | "EN_PROGRESO" | "COMPLETADO" | "CANCELADO"
export type TipoEvento = "FECHA_LIMITE" | "COMPROMISO" | "RECORDATORIO" | "REUNION" | "OTRO"
export type PrioridadEvento = "ALTA" | "MEDIA" | "BAJA"
