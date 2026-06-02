import { fetcher } from "@/shared/api/fetcher"
import type { NormaDetalleResponse } from "../model/types"

export const consultarNorma = (id: number): Promise<NormaDetalleResponse> =>
  fetcher(`/api/v1/normatividad/${id}`)
