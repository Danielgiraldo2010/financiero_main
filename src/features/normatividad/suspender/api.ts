import { fetcher } from "@/shared/api/fetcher"

export const suspenderNorma = (id: number): Promise<void> =>
  fetcher(`/api/v1/normatividad/${id}/suspender`, { method: "POST" })
