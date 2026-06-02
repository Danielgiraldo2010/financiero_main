// features/integracion/exportaciones/chip/api.ts

import { fetcher } from "@/shared/api/fetcher"
import type { Sincronizacion } from "../../model/types"

export function exportarCHIP(vigencia: number): Promise<Sincronizacion> {
  return fetcher(`/api/v1/integracion/chip?vigencia=${vigencia}`, { method: "POST" })
}