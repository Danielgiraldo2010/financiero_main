import { fetcher } from "@/shared/api/fetcher";
import type { DocumentoEntidad } from "../model/types";
import { toNumber } from "../model/mappers";

export async function getDocumentosPorEntidad(
  tipo: string,
  id: number
): Promise<DocumentoEntidad[]> {
  const data = await fetcher<Record<string, unknown>[]>(
    `/api/v1/documentos/entidad/${tipo}/${id}`
  );
  return data.map((d) => ({
    id: toNumber(d.id as number | string),
    documentoId: toNumber(d.documentoId as number | string),
    nombreDocumento: (d.nombreDocumento as string) ?? "",
    tipoDocumento: (d.tipoDocumento as string) ?? "",
    entidadTipo: (d.entidadTipo as string) ?? "",
    entidadId: toNumber(d.entidadId as number | string),
    esPrincipal: (d.esPrincipal as boolean) ?? false,
    createdAt: (d.createdAt as string) ?? "",
  }));
}
