import type { Documento, DocumentoBusqueda } from "./types";

/** Normaliza el id que el backend puede devolver como string o number */
export function toNumber(val: number | string | null | undefined): number {
  if (val === null || val === undefined) return 0;
  return typeof val === "string" ? parseInt(val, 10) : val;
}

export function mapDocumento(dto: Record<string, unknown>): Documento {
  return {
    id: toNumber(dto.id as number | string),
    nombre: (dto.nombre as string) ?? "",
    nombreOriginal: (dto.nombreOriginal as string) ?? "",
    tipoDocumento: (dto.tipoDocumento as string) ?? "",
    descripcion: (dto.descripcion as string | null) ?? null,
    unidadEjecutoraId: dto.unidadEjecutoraId
      ? toNumber(dto.unidadEjecutoraId as number | string)
      : null,
    urlAlmacenamiento: (dto.urlAlmacenamiento as string) ?? "",
    proveedorStorage: (dto.proveedorStorage as string) ?? "",
    hashSha256: (dto.hashSha256 as string | null) ?? null,
    tamanioBytes: dto.tamanioBytes
      ? toNumber(dto.tamanioBytes as number | string)
      : null,
    mimeType: (dto.mimeType as string | null) ?? null,
    vigencia: dto.vigencia
      ? toNumber(dto.vigencia as number | string)
      : null,
    subidoPor: (dto.subidoPor as string | null) ?? null,
    fechaSubida: (dto.fechaSubida as string) ?? "",
    estado: (dto.estado as "ACTIVO" | "ARCHIVADO" | "ELIMINADO") ?? "ACTIVO",
    esPublico: (dto.esPublico as boolean) ?? false,
  };
}

export function mapDocumentoBusqueda(
  dto: Record<string, unknown>
): DocumentoBusqueda {
  return {
    id: toNumber(dto.id as number | string),
    nombre: (dto.nombre as string) ?? "",
    nombreOriginal: (dto.nombreOriginal as string) ?? "",
    tipoDocumento: (dto.tipoDocumento as string) ?? "",
    estado:
      (dto.estado as "ACTIVO" | "ARCHIVADO" | "ELIMINADO") ?? "ACTIVO",
    vigencia: dto.vigencia
      ? toNumber(dto.vigencia as number | string)
      : null,
    subidoPor: (dto.subidoPor as string | null) ?? null,
    fechaSubida: (dto.fechaSubida as string) ?? "",
  };
}
