import { fetcher } from "@/shared/api/fetcher";
import type { VincularDocumentoRequest } from "../model/types";

export async function vincularDocumento(
  documentoId: number,
  request: VincularDocumentoRequest
): Promise<void> {
  await fetcher(`/api/v1/documentos/${documentoId}/vincular`, {
    method: "POST",
    body: JSON.stringify(request),
  });
}
