// features/presupuesto/model/types.ts
// Tipos derivados de los schemas OpenAPI del backend (v1.json)
// NO inventar campos — solo los declarados en required + properties

// ── Ingresos / Gastos ─────────────────────────────────────────────────────

// Query params compartidos para ingresos y gastos
export interface PresupuestoLineasParams {
  vigencia?: number;
  proyecto?: string;
}

// ── Resumen Ejecución Presupuestal ────────────────────────────────────────
// GET /api/v1/presupuesto/resumen
export interface ResumenEjecucionPresupuestal {
  id: number;
  vigencia: number;
  unidadEjecutoraId: number;
  unidadEjecutora: string;
  totalPresupuestoIngresos: number;
  totalPresupuestoGastos: number;
  totalEjecutadoIngresos: number;
  totalEjecutadoGastos: number;
  porcentajeEjecucionIngresos: number;
  porcentajeEjecucionGastos: number;
  saldoDisponibleGastos: number;
  estadoActual: string;
}

// ── Techo Presupuestal ────────────────────────────────────────────────────
// GET /api/v1/presupuesto/techo  |  POST /api/v1/presupuesto/techo
export interface TechoPresupuestalResponse {
  id: number;
  vigencia: number;
  unidadEjecutoraId: number;
  unidadEjecutora: string;
  valorTecho: number;
  valorApropiado: number;
  faltanteGestionar: number;
  estado: string;
  fechaComunicacion: string | null;
  urlComunicacion: string | null;
  observaciones: string | null;
}

export interface RegistrarTechoCommand {
  vigencia: number;
  valorTecho: number;
  fechaComunicacion?: string;
  urlComunicacion?: string;
  observaciones?: string;
}

// ── Etapas de Aprobación ──────────────────────────────────────────────────
// GET /api/v1/presupuesto/etapas
// POST /api/v1/presupuesto/etapas/{id}/completar
export interface EtapaAprobacionResponse {
  id: number;
  vigencia: number;
  unidadEjecutoraId: number;
  etapa: string;
  orden: number;
  estado: string;         // PENDIENTE | EN_CURSO | COMPLETADA
  fechaInicio: string;
  fechaFin: string;
  responsable: string;
  observaciones: string | null;
  urlActa: string | null;
  siguienteAccion: string;
}

export interface CompletarEtapaCommand {
  id: number;
  observaciones: string | null;
  urlActa: string | null;
}

// ── Ejecución Mensual ─────────────────────────────────────────────────────
// GET /api/v1/presupuesto/ejecucion-mensual
export interface EjecucionMensualResponse {
  id: number;
  vigencia: number;
  mes: number;
  nombreMes: string;
  rubroGasto: string;
  presupuestoMensual: number;
  ejecutadoMensual: number;
  porcentajeEjecucion: number;
}

export interface EjecucionMensualParams {
  vigencia?: number;
  mes?: number;
}

// ── Query params comunes ──────────────────────────────────────────────────
export interface VigenciaParams {
  vigencia?: number;
}

// ── Ingresos — espejo de PresupuestoIngresoResponse del backend ───────────
export interface LineaIngresoResponse {
  id: number
  vigencia: number
  unidadEjecutoraId: number
  unidadEjecutora: string
  proyectoId: number | null
  proyectoNombre: string | null
  rubroIngreso: string
  fuenteRecurso: string
  tipoMatricula: string | null
  valorInicial: number
  valorAdicion: number
  valorReduccion: number
  valorDefinitivo: number
  valorEjecutado: number
  saldoPorRecaudar: number
  descripcion: string | null
}

// ── Gastos — espejo de PresupuestoGastoResponse del backend ──────────────
export interface LineaGastoResponse {
  id: number
  vigencia: number
  unidadEjecutoraId: number
  unidadEjecutora: string
  proyectoId: number | null
  proyectoNombre: string | null
  rubroGasto: string
  fuenteRecurso: string
  programaAcademico: string | null
  valorInicial: number
  valorAdicion: number
  valorReduccion: number
  valorTraslado: number
  valorDefinitivo: number
  valorComprometido: number
  valorEjecutado: number
  saldoDisponible: number
  descripcion: string | null
}
