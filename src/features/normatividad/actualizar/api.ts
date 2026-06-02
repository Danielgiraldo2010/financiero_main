import { fetcher } from "@/shared/api/fetcher"
import type { ActualizarNormaRequest } from "../model/types"

export const actualizarNorma = (id: number, body: ActualizarNormaRequest): Promise<void> =>
  fetcher(`/api/v1/normatividad/${id}`, { method: "PUT", body: JSON.stringify(body) })
