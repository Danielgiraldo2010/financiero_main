// --- Cierre de Vigencia ------------------------------------------------------
export type EstadoCierre = 'BORRADOR' | 'EN_REVISION' | 'APROBADO' | 'CERRADO'

export interface CierreVigencia {
  id: number
  vigencia: number
  unidadEjecutoraId: number
  unidadEjecutoraName: string
  fechaCierre: string
  totalIngresosApropiados: number
  totalIngresosRecaudados: number
  totalGastosApropiados: number
  totalGastosComprometidos: number
  totalGastosPagados: number
  saldoIngresosNoRecaudados: number
  saldoGastosNoEjecutados: number
  excedenteNeto: number
  estado: EstadoCierre
  usuarioCierre: string
  observaciones?: string | null
  urlActaCierre?: string | null
}

export interface IniciarCierreCommand {
  vigencia: number
  unidadEjecutoraId: number
  observaciones?: string | null
}

export interface AprobarCierreCommand {
  id: number
  observaciones: string
}

export interface CerrarDefinitivoCommand {
  id: number
  urlActaCierre: string
}

// --- Recursos de Balance -----------------------------------------------------
export type EstadoRecurso = 'IDENTIFICADO' | 'VALIDADO' | 'INCORPORADO' | 'EJECUTADO'

export interface RecursoBalance {
  id: number
  cierreVigenciaId: number
  vigenciaOrigen: number
  vigenciaDestino: number
  unidadEjecutoraId: number
  tipo: string
  fuenteRecursoId: number
  rubroOrigenId?: number | null
  rubroOrigenDescripcion?: string | null
  valorIdentificado: number
  valorDisponible: number
  valorIncorporado: number
  valorEjecutado: number
  saldoLibre: number
  destinacionEspecifica?: string | null
  estado: EstadoRecurso
}

export interface RegistrarRecursoCommand {
  cierreVigenciaId: number
  vigenciaOrigen: number
  vigenciaDestino: number
  unidadEjecutoraId: number
  tipo: string
  fuenteRecursoId: number
  rubroOrigenId?: number | null
  rubroOrigenDescripcion?: string | null
  valorIdentificado: number
  destinacionEspecifica?: string | null
}

export interface IncorporarRecursoCommand {
  id: number
  presupuestoIngresoId: number
  valorIncorporado: number
  fechaIncorporacion: string
  numeroAcuerdo: string
  tipoActo: string
  urlActoAdministrativo?: string | null
}

// --- Conciliacion de Balance -------------------------------------------------
export type EstadoConciliacion = 'PENDIENTE' | 'CONCILIADO' | 'CON_DIFERENCIA'

export interface ConciliacionBalance {
  id: number
  recursoBalanceId: number
  fechaCorte: string
  valorSistema: number
  valorTesoreria: number
  diferencia: number
  explicacionDiferencia?: string | null
  estado: EstadoConciliacion
  usuarioConcilia?: string | null
  fechaConciliacion?: string | null
  urlSoporte?: string | null
}

export interface RegistrarConciliacionCommand {
  recursoBalanceId: number
  fechaCorte: string
  valorSistema: number
  valorTesoreria: number
  urlSoporte?: string | null
}

export interface ConciliarBalanceCommand {
  id: number
  explicacionDiferencia?: string | null
}

export interface DiferenciaConciliacion {
  id: number
  recursoBalanceId: number
  fechaCorte: string
  diferencia: number
  explicacionDiferencia?: string | null
  estado: EstadoConciliacion
}

// --- Recaudos Reales ---------------------------------------------------------
export type EstadoRecaudo = 'PENDIENTE' | 'CONCILIADO' | 'ANULADO'
export type TipoEntidad = 'NACION' | 'DEPARTAMENTO' | 'MUNICIPIO' | 'PRIVADO' | 'OTRO'

export interface RecaudoReal {
  id: number
  presupuestoIngresoId: number
  vigencia: number
  periodo: number
  fechaGiro: string
  numeroGiro: string
  entidadPagadora: string
  tipoEntidad: TipoEntidad
  concepto: string
  valor: number
  numeroResolucion?: string | null
  urlSoporte?: string | null
  estado: EstadoRecaudo
  observaciones?: string | null
}

export interface RegistrarRecaudoCommand {
  presupuestoIngresoId: number
  vigencia: number
  periodo: number
  fechaGiro: string
  numeroGiro: string
  entidadPagadora: string
  tipoEntidad: TipoEntidad
  concepto: string
  valor: number
  numeroResolucion?: string | null
  urlSoporte?: string | null
}

export interface ConciliarRecaudoCommand {
  id: number
  observaciones?: string | null
}

// --- Flujo de Caja -----------------------------------------------------------
export interface FlujoCajaMensual {
  vigencia: number
  mes: number
  unidadEjecutoraId: number
  ingresosPresupuestados: number
  ingresosRecaudados: number
  diferenciaIngresos: number
  gastosApropiados: number
  gastosComprometidos: number
  gastosPagados: number
  saldoPorPagar: number
  saldoCajaCalculado: number
  saldoCajaReal: number
  diferenciaCaja: number
}

export interface ResumenAnual {
  vigencia: number
  totalIngresosPresupuestados: number
  totalIngresosRecaudados: number
  porcentajeRecaudo: number
  totalGastosApropiados: number
  totalGastosComprometidos: number
  totalGastosPagados: number
  porcentajeEjecucion: number
  saldoCaja: number
  meses?: FlujoCajaMensual[]
}
