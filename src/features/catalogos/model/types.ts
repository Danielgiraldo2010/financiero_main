import type { PagedResult } from "@/shared/api/types"

// ── Unidades Ejecutoras ──────────────────────────────────
export interface UnidadEjecutoraResponse {
  id: number
  codigo: string
  nombre: string
  nivel: number
  padreId: number | null
  padreNombre: string | null
  estado: string
}
export interface UnidadEjecutoraDetalleResponse extends UnidadEjecutoraResponse {
  hijos: UnidadEjecutoraResponse[]
}
export interface CrearUECommand {
  codigo: string
  nombre: string
  nivel: number
  padreId: number | null
}
export interface ModificarUECommand {
  id: number
  nombre: string
  nivel: string | null
}
export type PagedUnidadesEjecutoras = PagedResult<UnidadEjecutoraResponse>

// ── Tipos de Proyecto ────────────────────────────────────
export interface TipoProyectoResponse {
  id: number
  codigo: string
  nombre: string
  descripcion: string | null
  requiereProgramaAcademico: boolean
  habilitaMatriculas: boolean
  habilitaNominaCatedratico: boolean
  habilitaSar: boolean
  estado: string
}

// ── Rubros Ingreso ───────────────────────────────────────
export interface RubroIngresoResponse {
  id: number
  codigoCicp: string
  nombre: string
  categoria: string | null
  subcategoria: string | null
  nivelDetalle: number | null
  estructuraId: number | null
  estructuraNombre: string | null
  estado: string
}
export interface CrearRubroIngresoCommand {
  codigoCicp: string
  nombre: string
  categoria: string
  subcategoria: string | null
  estructuraId: number | null
}
export interface ModificarRubroIngresoCommand {
  id: number
  codigoCicp: string
  nombre: string
  categoria: string
  subcategoria: string | null
  estructuraId: number | null
}
export type PagedRubrosIngreso = PagedResult<RubroIngresoResponse>

// ── Rubros Gasto ─────────────────────────────────────────
export interface RubroGastoResponse {
  id: number
  codigoCcp: string
  nombre: string
  tipoGasto: string
  clasificacionFunc: string
  estructuraId: number | null
  estructuraNombre: string | null
  estado: string
}
export interface CrearRubroGastoCommand {
  codigoCcp: string
  nombre: string
  tipoGasto: string
  clasificacionFunc: string
  estructuraId: number | null
}
export interface ModificarRubroGastoCommand {
  id: number
  codigoCcp: string
  nombre: string
  tipoGasto: string
  clasificacionFunc: string
  estructuraId: number | null
}
export type PagedRubrosGasto = PagedResult<RubroGastoResponse>

// ── Programas Academicos ─────────────────────────────────
export interface ProgramaAcademicoResponse {
  id: number
  codigo: string
  nombre: string
  nivel: string
  facultadId: number | null
  facultadNombre: string | null
  estado: string
}
export interface CrearProgramaCommand {
  codigo: string
  nombre: string
  nivel: string
  facultadId: number
}
export interface ModificarProgramaCommand {
  id: number
  codigo: string
  nombre: string
  nivel: string
  facultadId: number
}
export type PagedProgramasAcademicos = PagedResult<ProgramaAcademicoResponse>

// ── Periodos Academicos ──────────────────────────────────
export interface PeriodoAcademicoResponse {
  id: number
  vigencia: number
  periodo: number
  nombre: string
  fechaInicio: string
  fechaFin: string
  estado: string
}
export interface CrearPeriodoCommand {
  vigencia: number
  periodo: number
  nombre: string
  fechaInicio: string
  fechaFin: string
}
export interface ModificarPeriodoCommand {
  id: number
  nombre: string
  fechaInicio: string
  fechaFin: string
}
export type PagedPeriodosAcademicos = PagedResult<PeriodoAcademicoResponse>

// ── Municipios ───────────────────────────────────────────
export interface MunicipioResponse {
  codigoMunicipio: number
  nombre: string
  departamento: string
}
export type PagedMunicipios = PagedResult<MunicipioResponse>

// ── Fuentes de Recursos ──────────────────────────────────
export interface FuenteRecursoResponse {
  id: number
  codigo: string
  nombre: string
  tipo: string
  descripcion: string | null
}
export interface CrearFuenteCommand {
  codigo: string
  nombre: string
  tipo: string
  descripcion: string | null
}
export interface ModificarFuenteCommand {
  id: number
  codigo: string
  nombre: string
  tipo: string
  descripcion: string | null
}
export type PagedFuentesRecursos = PagedResult<FuenteRecursoResponse>

// ── Fechas Limite ────────────────────────────────────────
export interface FechaLimiteResponse {
  id: number
  vigencia: number
  tipoLimite: string
  nombre: string
  fechaLimite: string
  fechaRecordatorio: string | null
  diasAnticipacionAlerta: number | null
  descripcion: string | null
  unidadEjecutoraId: number | null
  unidadEjecutoraNombre: string | null
}
export interface CrearFechaLimiteCommand {
  vigencia: number
  tipoLimite: string
  nombre: string
  fechaLimite: string
  fechaRecordatorio: string | null
  diasAnticipacion: number | null
  descripcion: string | null
  unidadEjecutoraId: number | null
}
export interface ModificarFechaLimiteCommand {
  id: number
  tipoLimite: string
  nombre: string
  fechaLimite: string
  fechaRecordatorio: string | null
  diasAnticipacion: number | null
  descripcion: string | null
  unidadEjecutoraId: number | null
}
export type PagedFechasLimite = PagedResult<FechaLimiteResponse>

// ── Descuentos ───────────────────────────────────────────
export interface DescuentoResponse {
  idDescuento: number
  nombre: string
  descripcion: string | null
  porcentaje: number
}
export interface CrearDescuentoCommand {
  nombre: string
  descripcion: string | null
  porcentaje: number
}
export interface ModificarDescuentoCommand {
  id: number
  nombre: string
  descripcion: string | null
  porcentaje: number
}
export type PagedDescuentos = PagedResult<DescuentoResponse>

// ── Conceptos Nomina ─────────────────────────────────────
export interface ConceptoNominaResponse {
  id: number
  codigo: string
  nombre: string
  tipo: string
  rubroGastoId: number | null
  rubroGastoNombre: string | null
  esFactorSalarial: boolean
  porcentajeAplicacion: number | null
  orden: number
  estado: string
}
export interface CrearConceptoCommand {
  codigo: string
  nombre: string
  tipo: string
  rubroGastoId: number | null
  esFactorSalarial: boolean
  porcentajeAplicacion: number | null
  orden: number
}
export interface ModificarConceptoCommand {
  id: number
  codigo: string
  nombre: string
  tipo: string
  rubroGastoId: number | null
  esFactorSalarial: boolean
  porcentajeAplicacion: number | null
  orden: number
}
export type PagedConceptosNomina = PagedResult<ConceptoNominaResponse>

// ── Apoyos Matricula ─────────────────────────────────────
export interface ApoyoMatriculaResponse {
  id: number
  codigo: string
  nombre: string
  tipo: string
  rubroIngresoId: number
  rubroIngresoNombre: string | null
}
export interface CrearApoyoCommand {
  codigo: string
  nombre: string
  tipo: string
  rubroIngresoId: number
}
export interface ModificarApoyoCommand {
  id: number
  codigo: string
  nombre: string
  tipo: string
  rubroIngresoId: number
}
export type PagedApoyosMatricula = PagedResult<ApoyoMatriculaResponse>

// ── Params comunes ───────────────────────────────────────
export interface ListarCatalogosParams {
  pagina?: number
  elementosPorPagina?: number
  busqueda?: string
}
export interface ListarConFiltroParams extends ListarCatalogosParams {
  vigencia?: number
  estado?: string
}
