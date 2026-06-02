export interface NormaResponse {
  id: number
  codigo: string
  tipo: string
  ambito: string
  titulo: string
  descripcion: string | null
  entidadEmisora: string | null
  fechaExpedicion: string | null
  fechaVigenciaDesde: string | null
  fechaVigenciaHasta: string | null
  urlDocumento: string | null
  estado: EstadoNorma
  createdAt: string
  totalRegistros: number
}

export interface NormaDetalleResponse {
  id: number
  codigo: string
  tipo: string
  ambito: string
  titulo: string
  descripcion: string | null
  entidadEmisora: string | null
  fechaExpedicion: string | null
  fechaVigenciaDesde: string | null
  fechaVigenciaHasta: string | null
  urlDocumento: string | null
  estado: EstadoNorma
  createdAt: string
  procesos: NormaProcesoResponse[]
}

export interface NormaProcesoResponse {
  id: number
  normaId: number
  dominio: string
  descripcionAplicacion: string | null
}

export interface NormaPorDominioResponse {
  normaId: number
  codigo: string
  tipo: string
  titulo: string
  entidadEmisora: string | null
  fechaExpedicion: string | null
  estado: EstadoNorma
  dominio: string
  descripcionAplicacion: string | null
}

export interface CrearNormaCommand {
  codigo: string
  tipo: string
  ambito: string
  titulo: string
  descripcion?: string | null
  entidadEmisora?: string | null
  fechaExpedicion?: string | null
  fechaVigenciaDesde?: string | null
  fechaVigenciaHasta?: string | null
  urlDocumento?: string | null
  procesos?: CrearNormaProcesoDto[] | null
}

export interface CrearNormaProcesoDto {
  dominio: string
  descripcionAplicacion?: string | null
}

export interface ActualizarNormaRequest {
  codigo: string
  tipo: string
  ambito: string
  titulo: string
  descripcion?: string | null
  entidadEmisora?: string | null
  fechaExpedicion?: string | null
  fechaVigenciaDesde?: string | null
  fechaVigenciaHasta?: string | null
  urlDocumento?: string | null
}

export interface AgregarProcesoRequest {
  dominio: string
  descripcionAplicacion?: string | null
}

export interface ListarNormasParams {
  pagina?: number
  tamano?: number
  tipo?: string
  ambito?: string
  vigente?: boolean
}
export interface PagedResult<T> {
  items: T[]
  totalItems: number
  pagina: number
  tamanoPagina: number
  totalPaginas: number
}
 
// 2. Reemplazar ListarNormasParams:
export interface ListarNormasParams {
  pagina?: number
  elementosPorPagina?: number
  tipo?: string
  ambito?: string
  vigente?: boolean
}
export type EstadoNorma = "VIGENTE" | "DEROGADA" | "SUSPENDIDA"
export type TipoNorma = "LEY" | "DECRETO" | "ACUERDO" | "RESOLUCION" | "CIRCULAR" | "OTRO"
export type AmbitoNorma = "NACIONAL" | "DEPARTAMENTAL" | "MUNICIPAL" | "INSTITUCIONAL"
export type DominioNorma = "NOMINA" | "VIATICOS" | "MATRICULAS" | "PRESUPUESTO" | "GENERAL"
