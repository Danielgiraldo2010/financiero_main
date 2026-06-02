import { fetcher } from "@/shared/api/fetcher";
import type { Documento, ActualizarDocumentoRequest } from "../model/types";
import { mapDocumento } from "../model/mappers";

export async function actualizarDocumento(
  id: number,
  request: ActualizarDocumentoRequest
): Promise<Documento> {
  const dto = await fetcher<Record<string, unknown>>(
    `/api/v1/documentos/${id}/actualizar`,
    {
      method: "POST",
      body: JSON.stringify(request),
    }
  );
  return mapDocumento(dto);
}
