import { fetcher } from "@/shared/api/fetcher"

export const derogarNorma = (id: number): Promise<void> =>
  fetcher(`/api/v1/normatividad/${id}/derogar`, { method: "POST" })
