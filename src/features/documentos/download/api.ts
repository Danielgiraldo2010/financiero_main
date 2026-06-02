import { fetcher } from "@/shared/api/fetcher";

// src/features/documentos/download/api.ts
import { getAccessToken } from "@/shared/api/auth/token-store";

export async function descargarDocumento(id: number): Promise<Blob> {
  const token = getAccessToken() ?? "";
  const res = await fetch(`/api/v1/documentos/${id}/descargar`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al descargar el documento");
  return res.blob();
}
