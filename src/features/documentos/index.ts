// ⭐ Componente reutilizable central — importar desde aquí en otros dominios
export { DocumentosPanel } from "./entity/ui/DocumentosPanel";

// Tipos públicos
export type {
  Documento,
  DocumentoEntidad,
  DocumentoBusqueda,
  TipoEntidadDocumento,
} from "./model/types";

// Query keys para invalidación externa
export { documentosKeys } from "./model/queryKeys";
