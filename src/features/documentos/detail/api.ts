import { fetcher } from "@/shared/api/fetcher";
import type { Documento, VersionDocumento, DescargaDocumento } from "../model/types";
import { mapDocumento, toNumber } from "../model/mappers";

export async function getDocumento(id: number): Promise<Documento> {
  const dto = await fetcher<Record<string, unknown>>(
    `/api/v1/documentos/${id}`
  );
  return mapDocumento(dto);
}

export async function getVersionesDocumento(id: number): Promise<VersionDocumento[]> {
  const data = await fetcher<Record<string, unknown>[]>(
    `/api/v1/documentos/${id}/versiones`
  );
  return data.map((v) => ({
    id: toNumber(v.id as number | string),
    documentoId: toNumber(v.documentoId as number | string),
    version: toNumber(v.version as number | string),
    nombre: (v.nombre as string) ?? "",
    hashSha256: (v.hashSha256 as string | null) ?? null,
    tamanioBytes: v.tamanioBytes ? toNumber(v.tamanioBytes as number | string) : null,
    subidoPor: (v.subidoPor as string | null) ?? null,
    fechaSubida: (v.fechaSubida as string) ?? "",
  }));
}

export async function getHistorialDescargas(id: number): Promise<DescargaDocumento[]> {
  const data = await fetcher<Record<string, unknown>[]>(
    `/api/v1/documentos/${id}/descargas`
  );
  return data.map((d) => ({
    id: toNumber(d.id as number | string),
    documentoId: toNumber(d.documentoId as number | string),
    usuarioId: (d.usuarioId as string | null) ?? null,
    fecha: (d.fecha as string) ?? "",
    ipAddress: (d.ipAddress as string | null) ?? null,
  }));
}
