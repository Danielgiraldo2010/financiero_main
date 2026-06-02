import { fetcher } from "@/shared/api/fetcher";

export async function reactivarDocumento(
  id: number,
  modificadoPor: string
): Promise<void> {
  await fetcher(`/api/v1/documentos/${id}/reactivar`, {
    method: "POST",
    body: JSON.stringify({ modificadoPor }),
  });
}
