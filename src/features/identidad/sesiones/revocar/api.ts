import { fetcher } from "@/shared/api/fetcher"

export async function revocarSesion(id: string): Promise<void> {
  return fetcher<void>(`/api/v1/admin/sesiones/${id}/revocar`, {
    method: "POST",
  })
}
