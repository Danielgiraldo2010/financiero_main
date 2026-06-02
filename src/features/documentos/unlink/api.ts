import { fetcher } from "@/shared/api/fetcher";

/**
 * Desvincula un documento de una entidad usando el vinculoId (no el documentoId).
 * vinculoId viene de DocumentoEntidad.id
 */
export async function desvincularDocumento(
  vinculoId: number,
  removidoPor: string
): Promise<void> {
  await fetcher(`/api/v1/documentos/desvincular/${vinculoId}`, {
    method: "POST",
    body: JSON.stringify({ removidoPor }),
  });
}
