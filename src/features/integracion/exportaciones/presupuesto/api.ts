// features/integracion/exportaciones/presupuesto/api.ts

import { fetcher } from "@/shared/api/fetcher"
import type { Sincronizacion } from "../../model/types"

export function exportarPresupuesto(vigencia: number): Promise<Sincronizacion> {
  return fetcher(`/api/v1/integracion/presupuesto?vigencia=${vigencia}`, { method: "POST" })
}