import type { BuscarDocumentosParams } from "./types";

export const documentosKeys = {
  all: ["documentos"] as const,

  // Búsqueda general
  searches: () => [...documentosKeys.all, "search"] as const,
  search: (params?: BuscarDocumentosParams) =>
    [...documentosKeys.searches(), params] as const,

  // Detalle
  details: () => [...documentosKeys.all, "detail"] as const,
  detail: (id: number) => [...documentosKeys.details(), id] as const,

  // Versiones de un documento
  versions: (id: number) =>
    [...documentosKeys.detail(id), "versions"] as const,

  // Historial de descargas de un documento
  downloads: (id: number) =>
    [...documentosKeys.detail(id), "downloads"] as const,

  // Documentos vinculados a una entidad
  entity: (tipo: string, id: number) =>
    [...documentosKeys.all, "entity", tipo, id] as const,
} as const;
