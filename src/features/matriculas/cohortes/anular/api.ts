import { fetcher } from "@/shared/api/fetcher"

export async function anularCohorte(id: number, motivo: string): Promise<boolean> {
  return fetcher<boolean>(`/api/v1/matriculas/cohortes/${id}/anular`, {
    method: "POST",
    body: JSON.stringify({ id, motivo }),
  })
}
