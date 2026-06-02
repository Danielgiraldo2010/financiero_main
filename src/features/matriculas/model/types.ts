// ─── Cohortes ───────────────────────────────────────────────────────────────
type ACTIVO = "ACTIVO"
type ANULADO = "ANULADO"
export interface CohorteResponse {
  id: number
  vigencia: number
  periodo: string
  programaAcademicoId: number
  programaAcademico: string
  nivelPrograma: string
  municipioId: number | null
  municipioNombre: string | null
  cohorte: number
  numeroEstudiantes: number
  valorMatriculaBase: number
  porcentajeDescuentoVotacion: number
  porcentajeOtrosDescuentos: number
  porcentajeDescuentoGratuidad: number
  tipoMatricula: string
  tipoMatriculaDescripcion: string | null
  unidadEjecutoraId: number
  rubroIngresoId: number
  rubroIngreso: string
  fuenteRecursoId: number
  fuenteRecurso: string
  transferenciaInternaId: number | null
  coberturaPickId: number | null
  descripcion: string | null
  valorTotalEstimado: number
  estado: ACTIVO | ANULADO
  motivoAnulacion: string | null
  updatedAt: string | null
}

export interface ModificarCohorteCommand {
  id: number
  numeroEstudiantes: number
  valorMatriculaBase: number
  porcentajeDescuentoVotacion: number
  porcentajeOtrosDescuentos: number
  porcentajeDescuentoGratuidad: number
  tipoMatricula?: string | null
  transferenciaInternaId?: number | null
  coberturaPickId?: number | null
  descripcion?: string | null
}

export interface AnularCohorteCommand {
  id: number
  motivo: string
}

export interface RegistrarCohorteCommand {
  vigencia: number
  periodo: string
  programaAcademicoId: number
  unidadEjecutoraId: number
  municipioId?: number | null
  cohorte: number
  numeroEstudiantes: number
  valorMatriculaBase: number
  tipoMatricula: string
  rubroIngresoId: number
  fuenteRecursoId: number
  porcentajeDescuentoVotacion?: number
  porcentajeOtrosDescuentos?: number
  porcentajeDescuentoGratuidad?: number
  transferenciaInternaId?: number | null
  coberturaPickId?: number | null
  descripcion?: string | null
}

// ─── Resumen ────────────────────────────────────────────────────────────────
export interface ResumenPorTipoResponse {
  tipoMatricula: string
  descripcion: string
  numEstudiantes: number
  valorTotal: number
  porcentaje: number
}

export interface ResumenMatriculaResponse {
  vigencia: number
  periodo: string
  unidadEjecutoraId: number
  unidadEjecutora: string
  totalEstudiantes: number
  totalIngresos: number
  porTipo: ResumenPorTipoResponse[]
}

// ─── Transferencias Internas ─────────────────────────────────────────────────
export interface TransferenciaInternaResponse {
  id: number
  vigencia: number
  periodo: string
  unidadEjecutoraDestinoId: number
  unidadEjecutoraNombre: string
  proyectoId: number | null
  proyectoNombre: string | null
  tipoTransferencia: string
  tipoTransferenciaDesc: string
  vicerrectoriaOrigen: string
  numeroActo: string | null
  fechaActo: string | null
  valor: number
  valorRecibido: number
  pendiente: number
  fechaGiro: string | null
  estado: string
  observaciones: string | null
  urlSoporte: string | null
}

export interface RegistrarTransferenciaCommand {
  vigencia: number
  periodo: string
  unidadEjecutoraDestinoId: number
  proyectoId?: number | null
  tipoTransferencia: string
  vicerrectoriaOrigen: string
  valor: number
  numeroActoAdministrativo?: string | null
  fechaActo?: string | null
  observaciones?: string | null
  urlSoporte?: string | null
}

export interface ConfirmarRecepcionCommand {
  id: number
  valorRecibido: number
  fechaGiro: string
  observaciones?: string | null
}

// ─── Cobertura PIC ───────────────────────────────────────────────────────────
export interface CoberturaPickResponse {
  id: number
  vigencia: number
  periodo: string
  programaAcademicoId: number
  programaNombre: string
  municipioId: number
  municipioNombre: string
  numEstudiantesBeneficiarios: number
  valorMatriculaBase: number
  porcentajeCobertura: number
  valorTotalPic: number
  estadoGiro: string
  fechaGiro: string | null
  urlSoporte: string | null
}

export interface RegistrarCoberturaCommand {
  vigencia: number
  periodo: string
  programaAcademicoId: number
  municipioId: number                  // INVARIANTE I2: ≠ Manizales
  numEstudiantesBeneficiarios: number
  valorMatriculaBase: number
  porcentajeCobertura?: number         // default 50
}

export interface ConfirmarGiroCommand {
  id: number
  fechaGiro: string
  urlSoporte?: string | null
}

// ─── Becas Posgrado Minciencias ──────────────────────────────────────────────
export interface BecaPosgradoResponse {
  id: number
  vigencia: number
  convocatoriaMinciencias: string
  tipoBeca: string
  programaAcademicoId: number
  programaNombre: string
  unidadEjecutoraId: number
  unidadEjecutora: string
  numBeneficiarios: number
  valorPorBeca: number
  valorTotal: number
  vicerrectoriaDetermina: boolean      // INVARIANTE I3: siempre true, oculto
  fechaResolucionMinisterio: string | null
  fechaGiroMinisterio: string | null
  fechaTransferenciaUe: string | null
  estado: string
  urlResolucion: string | null
}

export interface RegistrarBecaCommand {
  vigencia: number
  convocatoriaMinciencias: string
  tipoBeca: string
  programaAcademicoId: number
  unidadEjecutoraId: number
  numBeneficiarios: number
  valorPorBeca: number
  urlResolucion?: string | null
  // vicerrectoriaDetermina se envía siempre como true — no exponer en form
}

export interface RegistrarTransferenciaBecaCommand {
  id: number
  fechaResolucionMinisterio: string
  fechaGiroMinisterio: string
  fechaTransferenciaUe: string
}

// ─── Paginación genérica ─────────────────────────────────────────────────────
export interface PagedResult<T> {
  items: T[]
  totalItems: number
  pagina: number
  tamanoPagina: number
  totalPaginas: number
  tieneSiguiente: boolean
  tieneAnterior: boolean
}
