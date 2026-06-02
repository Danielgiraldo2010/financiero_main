// ─── Nómina — tipos base ────────────────────────────────────────────────────
// Alineados con BD real + OpenAPI real

export type TipoEmpleado =
  | 'PLANTA'
  | 'OCASIONAL'
  | 'CATEDRATICO'
  | 'SUPERNUMERARIO'
  | 'PLANTA_TEMPORAL'

export type EstadoEmpleado = 'ACTIVO' | 'INACTIVO'

export interface Empleado {
  id: number
  tipoIdentificacion: string
  numeroIdentificacion: string
  nombreCompleto: string
  email: string | null
  telefono: string | null
  tipoEmpleado: TipoEmpleado
  cargo: string | null
  salarioBaseMensual: number
  programaAcademicoId: number | null
  programaAcademicoNombre: string | null
  nivelPrograma: string | null
  unidadEjecutoraId: number
  unidadEjecutoraNombre: string
  estado: EstadoEmpleado
  fechaIngreso: string | null
  fechaRetiro: string | null
}

// ─── Puntos salariales ───────────────────────────────────────────────────────
// PuntosSalarialesResponse real incluye valorHoraCatedraPregrado/Posgrado
// Atención: el backend devuelve "vigenteDesdE" (E mayúscula) — typo confirmado en OpenAPI
export interface PuntoSalarial {
  id: number
  vigencia: number
  decretoNorma: string
  categoria: string
  nivel: number
  puntosBase: number
  valorPunto: number
  valorHoraCatedraPregrado: number
  valorHoraCatedraPosgrado: number
  factorCategoria: number
  vigenteDesdE: string    // ← typo del backend, E mayúscula
  vigenteHasta: string | null
  estado: string
}

// ─── Plan de clases ──────────────────────────────────────────────────────────
// PlanClasesResponse real (OpenAPI verificado)
export type EstadoPlanClases = 'ABIERTO' | 'CERRADO'

export interface PlanClases {
  id: number
  empleadoId: number
  empleadoNombre: string
  tipoEmpleado: string
  periodoAcademicoId: number
  periodoNombre: string
  programaAcademicoId: number
  programaNombre: string
  nivelPrograma: string       // 'PREGRADO' | 'POSGRADO' — string libre del backend
  asignatura: string
  codigoAsignatura: string | null
  grupo: string | null
  horasSemanales: number
  semanas: number
  totalHoras: number          // calculado por backend: horasSemanales × semanas
  valorHora: number           // calculado por backend según norma + puntosSalariales
  valorTotal: number          // totalHoras × valorHora
  normaLiquidacion: string
  puntosSalarialesId: number | null
  estado: EstadoPlanClases
  observaciones: string | null
  costoTotalEstimado: number | null  // puede ser null en planes abiertos
}

// ─── Horas dictadas ──────────────────────────────────────────────────────────
// HorasDictadasResponse real (OpenAPI verificado)
export interface HorasDictadas {
  id: number
  planClasesId: number
  empleadoNombre: string
  asignatura: string
  mes: number
  nombreMes: string
  horasProyectadas: number
  horasReales: number
  diferencia: number        // backend calcula: horasReales - horasProyectadas
  justificacion: string | null
  estado: string
}

// Tipo de respuesta paginada (alinear con PagedResult del backend)
export interface PagedResult<T> {
  items: T[]
  totalItems: number
  pagina: number
  tamanoPagina: number
  totalPaginas: number
}
