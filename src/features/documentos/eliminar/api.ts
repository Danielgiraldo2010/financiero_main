import { fetcher } from "@/shared/api/fetcher";

export async function eliminarDocumento(
  id: number,
  eliminadoPor: string
): Promise<void> {
  await fetcher(`/api/v1/documentos/${id}/eliminar`, {
    method: "POST",
    body: JSON.stringify({ eliminadoPor }),
  });
}
