// src\features\proyectos\model\types.ts
// ─── Proyectos Especiales — Tipos de dominio ────────────────────────────────

export type EstadoPresupuesto =
  | 'SIN_PRESUPUESTO'
  | 'BORRADOR'
  | 'REVISADO'
  | 'APROBADO_DECANO'
  | 'APROBADO_PLANEACION'
  | 'CONSOLIDADO'
  | 'EN_EJECUCION'
  | 'CERRADO'

export type EstadoProyecto = 'ACTIVO' | 'ANULADO' | 'CERRADO'

// ── v5: categorías del backend ────────────────────────────────
export type CategoriaProyecto =
  | 'ESPECIAL'
  | 'ESTRATEGICO'
  | 'INVERSION'
  | 'MISIONAL'
  | 'FUNCIONAMIENTO'

export interface TipoProyecto {
  id:                        number
  codigo:                    string
  nombre:                    string
  descripcion:               string
  // Flags de comportamiento (pre-v5)
  requiereProgramaAcademico: boolean
  habilitaMatriculas:        boolean
  habilitaNominaCatedratico: boolean
  habilitaSar:               boolean
  // Campos v5
  categoria:                 CategoriaProyecto
  requiereInscripcionDnp:    boolean
  generaTransferenciaNc:     boolean
  afectaHorasDocente:        boolean
  porcentajeTransferencia:   number | null
  estado:                    'ACTIVO' | 'INACTIVO'
}

export interface ProgramaAcademico {
  id:     number
  nombre: string
  nivel:  string
}

export interface Proyecto {
  id:                      number
  codigo:                  string
  nombre:                  string
  unidadEjecutoraId:       number
  unidadEjecutoraNombre:   string
  tipoProyectoId:          number
  tipoProyectoNombre:      string
  programaAcademicoId?:    number | undefined
  programaAcademicoNombre?: string | undefined
  nivelPrograma?:          string | undefined
  valorTotal:              number
  fechaInicio?:            string | undefined
  fechaFin?:               string | undefined
  estado:                  EstadoProyecto
  estadoPresupuesto:       EstadoPresupuesto
  vigenciaActiva:          number
}

export interface PagedProyectos {
  items:          Proyecto[]
  totalRegistros: number
  pagina:         number
  tamanoPagina:   number
}

export interface TimelineItemProyecto {
  id:          number
  proyectoId:  number
  vigencia:    number
  estado:      EstadoPresupuesto
  fechaEstado: string
  usuario:     string
}

export interface ListarProyectosParams {
  Pagina?:            number | undefined
  TamanoPagina?:      number | undefined
  Q?:                 string | undefined
  Vigencia?:          number | undefined
  TipoProyectoId?:    number | undefined
  EstadoPresupuesto?: EstadoPresupuesto | undefined
  Estado?:            EstadoProyecto | undefined
  UnidadEjecutoraId?: number | undefined
}

export interface RegistrarProyectoPayload {
  Codigo:               string
  Nombre:               string
  UnidadEjecutoraId:    number
  TipoProyectoId:       number
  ProgramaAcademicoId?: number | undefined
  ValorTotal:           number
  FechaInicio?:         string | undefined
  FechaFin?:            string | undefined
  VigenciaActiva:       number
}

export interface ModificarProyectoPayload {
  Nombre:       string
  ValorTotal:   number
  FechaInicio?: string | undefined
  FechaFin?:    string | undefined
}

// ─── Contratos ────────────────────────────────────────────────────────────────

export interface ContratoResponse {
  id:                number
  numeroContrato:    string
  proyectoId:        number
  proyectoNombre:    string
  unidadEjecutoraId: number
  contratista:       string
  nitCedula:         string | null
  objetoContrato:    string
  valorTotal:        number
  valorPagado:       number
  saldoPorPagar:     number
  fechaInicio:       string
  fechaFin:          string
  estado:            string
  supervisor:        string | null
  urlDocumento:      string | null
}

export interface PagoContratoResponse {
  id:            number
  contratoId:    number
  numeroPago:    string
  fechaPago:     string
  valor:         number
  comprobante:   string | null
  urlSoporte:    string | null
  observaciones: string | null
}

export interface ListarContratosParams {
  Vigencia?:          number
  UnidadEjecutoraId?: number
  Estado?:            string
  Pagina?:            number
  TamanoPagina?:      number
}

export interface RegistrarContratoPayload {
  proyectoId:        number
  unidadEjecutoraId: number
  numeroContrato:    string
  contratista:       string
  nitCedula?:        string
  objetoContrato:    string
  valorTotal:        number
  rubroGastoId:      number
  fuenteRecursoId:   number
  fechaInicio:       string
  fechaFin:          string
  supervisor?:       string
  urlDocumento?:     string
}

export interface RegistrarPagoPayload {
  numeroPago:     string
  fechaPago:      string
  valor:          number
  comprobante?:   string
  urlSoporte?:    string
  observaciones?: string
}

// ─── Cartera ──────────────────────────────────────────────────────────────────

export interface CarteraFacturaResponse {
  id:                number
  numeroFactura:     string
  unidadEjecutoraId: number
  proyectoId:        number | null
  proyectoNombre:    string | null
  clienteNombre:     string
  clienteNit:        string | null
  concepto:          string
  valorFactura:      number
  valorPagado:       number
  valorPendiente:    number
  diasMora:          number
  fechaFactura:      string
  fechaVencimiento:  string
  estado:            string
}

export interface ListarCarteraParams {
  Vigencia?:          number
  UnidadEjecutoraId?: number
  Estado?:            string
  SoloMora?:          boolean
  Pagina?:            number
  TamanoPagina?:      number
}

export interface RegistrarFacturaPayload {
  numeroFactura:     string
  vigencia:          number
  unidadEjecutoraId: number
  proyectoId?:       number
  contratoId?:       number
  clienteNombre:     string
  clienteNit?:       string
  concepto:          string
  rubroIngresoId:    number
  valorFactura:      number
  fechaFactura:      string
  fechaVencimiento:  string
  urlDocumento?:     string
}

export interface PagedContratos {
  items:          ContratoResponse[]
  totalRegistros: number
  pagina:         number
  tamanoPagina:   number
}

export interface PagedCartera {
  items:          CarteraFacturaResponse[]
  totalRegistros: number
  pagina:         number
  tamanoPagina:   number
}