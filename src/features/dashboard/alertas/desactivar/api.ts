import { fetcher } from "@/shared/api/fetcher"

export function desactivarAlerta(id: number): Promise<boolean> {
  return fetcher<boolean>(`/api/v1/dashboard/alertas/${id}/desactivar`, {
    method: "POST",
    body: JSON.stringify({}),
  })
}
