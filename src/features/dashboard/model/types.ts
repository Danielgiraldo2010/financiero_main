// ── Dashboard — Tipos del dominio ──────────────────────────────────────────

// ── Resumen Ejecutivo ────────────────────────────────────────────────────────
export interface ResumenEjecutivo {
  vigencia: number
  totalPresupuestoIngresos: number
  totalEjecutadoIngresos: number
  porcentajeEjecucionIngresos: number
  totalPresupuestoGastos: number
  totalEjecutadoGastos: number
  porcentajeEjecucionGastos: number
  sarPendientes: number
  cdpPendientes: number
  proyectosActivos: number
  fechaCorte: string
}

export interface KPIDashboard {
  indicador: string
  valor: number
  unidad: string
  variacion: number | null
  tendencia: "SUBE" | "BAJA" | "ESTABLE" | null
  meta: number | null
}

// ── Semáforo Proyectos ───────────────────────────────────────────────────────
export type ColorSemaforo = "VERDE" | "AMARILLO" | "ROJO"

export interface ProyectoEstadoDashboard {
  id: number
  codigo: string
  nombre: string
  unidadEjecutoraNombre: string
  estadoPresupuesto: string
  porcentajeEjecucion: number
  semaforoColor: ColorSemaforo
  semaforoMensaje: string
  valorTotal: number
  valorEjecutado: number
}

export interface ResumenSemaforo {
  vigencia: number
  totalProyectos: number
  verde: number
  amarillo: number
  rojo: number
  proyectos: ProyectoEstadoDashboard[]
}

// ── Agenda ───────────────────────────────────────────────────────────────────
export interface EventoAgenda {
  id: number
  titulo: string
  descripcion: string | null
  fechaEvento: string
  tipo: string
  prioridad: "ALTA" | "MEDIA" | "BAJA"
  cumplido: boolean
  diasRestantes: number | null
}

// ── Alertas ──────────────────────────────────────────────────────────────────
export type NivelAlerta = "CRITICA" | "ALTA" | "MEDIA" | "BAJA" | "INFO"

export interface AlertaDashboard {
  id: number
  titulo: string
  mensaje: string
  nivelAlerta: NivelAlerta
  tipo: string
  proyectoId: number | null
  proyectoNombre: string | null
  unidadEjecutoraId: number | null
  unidadEjecutoraNombre: string | null
  vigencia: number
  activa: boolean
  fechaGeneracion: string
  fechaDesactivacion: string | null
}

export interface GenerarAlertasResult {
  alertasGeneradas: number
  mensaje: string
}

// ── Eventos de Seguimiento ───────────────────────────────────────────────────
export type EstadoEvento = "PENDIENTE" | "EN_PROCESO" | "COMPLETADO" | "VENCIDO"

export interface EventoSeguimiento {
  id: number
  titulo: string
  descripcion: string | null
  tipo: string
  fechaLimite: string
  fechaCompletado: string | null
  estado: EstadoEvento
  responsableId: string | null
  responsableNombre: string | null
  proyectoId: number | null
  proyectoNombre: string | null
  vigencia: number
}

export interface CompletarEventoResult {
  id: number
  completado: boolean
  fechaCompletado: string
}

// ── Informes ─────────────────────────────────────────────────────────────────
export const TIPOS_INFORME = [
  "EJECUCION_PRESUPUESTAL",
  "FLUJO_CAJA",
  "NOMINA",
  "CONCILIACION_NOMINA",
  "SAR",
  "CARTERA",
  "CHIP",
  "AUDITORIA",
] as const

export type TipoInforme = typeof TIPOS_INFORME[number]

export type EstadoInforme = "PENDIENTE" | "PROCESANDO" | "LISTO" | "ERROR"

export interface TipoInformeDetalle {
  tipo: TipoInforme
  nombre: string
  descripcion: string
  parametrosRequeridos: string[]
}

export interface SolicitudInforme {
  tipo: TipoInforme
  vigencia: number
  unidadEjecutoraId?: number | undefined
  proyectoId?: number | undefined
  fechaDesde?: string | undefined
  fechaHasta?: string | undefined
  parametrosExtra?: Record<string, string> | undefined
}

export interface InformeSolicitado {
  id: string
  tipo: TipoInforme
  tipoNombre: string
  estado: EstadoInforme
  vigencia: number
  solicitadoPor: string
  fechaSolicitud: string
  fechaCompletado: string | null
  urlDescarga: string | null
  mensajeError: string | null
  parametros: Record<string, string>
}

// ── Params ────────────────────────────────────────────────────────────────────
export interface DashboardParams {
  vigencia?: number | undefined
}

export interface EventosSeguimientoParams {
  vigencia?: number | undefined
  estado?: EstadoEvento | undefined
  pagina?: number | undefined
  tamanoPagina?: number | undefined
}
