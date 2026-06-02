import { fetcher } from "@/shared/api/fetcher"

export const reactivarNorma = (id: number): Promise<void> =>
  fetcher(`/api/v1/normatividad/${id}/reactivar`, { method: "POST" })
