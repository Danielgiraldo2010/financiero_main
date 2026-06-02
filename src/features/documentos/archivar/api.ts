import { fetcher } from "@/shared/api/fetcher";

export async function archivarDocumento(
  id: number,
  modificadoPor: string
): Promise<void> {
  await fetcher(`/api/v1/documentos/${id}/archivar`, {
    method: "POST",
    body: JSON.stringify({ modificadoPor }),
  });
}
