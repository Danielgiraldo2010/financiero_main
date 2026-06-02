// features/integracion/sistemas/detalle/api.ts

import { fetcher } from "@/shared/api/fetcher"
import type { SistemaIntegradoDetalle } from "../../model/types"

export function consultarSistema(id: number): Promise<SistemaIntegradoDetalle> {
  return fetcher(`/api/v1/integracion/sistemas/${id}`)
}