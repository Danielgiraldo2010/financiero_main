// features/integracion/sincronizaciones/estado/api.ts

import { fetcher } from "@/shared/api/fetcher"
import type { Sincronizacion } from "../../model/types"

export function consultarEstadoSincronizacion(id: number): Promise<Sincronizacion> {
  return fetcher(`/api/v1/integracion/sincronizaciones/${id}`)
}