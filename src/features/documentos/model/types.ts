// ─── Documento principal (DocumentoResponse) ───────────────────────────────
export interface Documento {
  id: number;
  nombre: string;
  nombreOriginal: string;
  tipoDocumento: string;
  descripcion: string | null;
  unidadEjecutoraId: number | null;
  urlAlmacenamiento: string;
  proveedorStorage: string;
  hashSha256: string | null;
  tamanioBytes: number | null;
  mimeType: string | null;
  vigencia: number | null;
  subidoPor: string | null;
  fechaSubida: string;
  estado: EstadoDocumento;
  esPublico: boolean;
}

// ─── Resultado de búsqueda (DocumentoBusquedaResponse) ──────────────────────
export interface DocumentoBusqueda {
  id: number;
  nombre: string;
  nombreOriginal: string;
  tipoDocumento: string;
  estado: EstadoDocumento;
  vigencia: number | null;
  subidoPor: string | null;
  fechaSubida: string;
}

// ─── Vínculo documento↔entidad (DocumentoEntidadResponse) ───────────────────
export interface DocumentoEntidad {
  id: number;           // vinculoId — usar para desvincular
  documentoId: number;
  nombreDocumento: string;
  tipoDocumento: string;
  entidadTipo: string;
  entidadId: number;
  esPrincipal: boolean;
  createdAt: string;
}

// ─── Historial de descarga (DescargaDocumentoResponse) ──────────────────────
export interface DescargaDocumento {
  id: number;
  documentoId: number;
  usuarioId: string | null;
  fecha: string;
  ipAddress: string | null;
}

// ─── Versión de documento ────────────────────────────────────────────────────
export interface VersionDocumento {
  id: number;
  documentoId: number;
  version: number;
  nombre: string;
  hashSha256: string | null;
  tamanioBytes: number | null;
  subidoPor: string | null;
  fechaSubida: string;
}

// ─── Requests ────────────────────────────────────────────────────────────────
export interface SubirDocumentoRequest {
  archivo: File;
  nombre: string;
  tipoDocumento: string;
  descripcion?: string;
  vigencia?: number;
  esPublico: boolean;
  unidadEjecutoraId?: number;
}

export interface ActualizarDocumentoRequest {
  nombre: string;
  descripcion: string | null;
  tipoDocumento: string;
  vigencia: number | null;
  esPublico: boolean | null;
  modificadoPor: string;
}

export interface ArchivarDocumentoRequest {
  modificadoPor: string;
}

export interface ReactivarDocumentoRequest {
  modificadoPor: string;
}

export interface EliminarDocumentoRequest {
  eliminadoPor: string;
}

export interface VincularDocumentoRequest {
  entidadTipo: string;
  entidadId: number;
  esPrincipal: boolean;
  creadoPor: string;
}

export interface DesvincularDocumentoRequest {
  removidoPor: string;
}

// ─── Paginación búsqueda ─────────────────────────────────────────────────────
export interface BuscarDocumentosParams {
  q?: string;
  tipo?: string;
  vigencia?: number;
  page?: number;
  pageSize?: number;
}

export interface BuscarDocumentosResult {
  items: DocumentoBusqueda[];
  totalRegistros: number;
  pagina: number;
  tamanoPagina: number;
  totalPaginas: number;
  tieneSiguiente: boolean;
  tieneAnterior: boolean;
}

// ─── Enums / literales ───────────────────────────────────────────────────────
export type EstadoDocumento = "ACTIVO" | "ARCHIVADO" | "ELIMINADO";

export type TipoEntidadDocumento =
  | "CDP"
  | "RP"
  | "OP"
  | "SAR"
  | "VIATICO"
  | "CONTRATO"
  | "MODIFICACION"
  | "PROYECTO"
  | string;
