// features/integracion/exportaciones/snies/api.ts

import { fetcher } from "@/shared/api/fetcher"
import type { Sincronizacion } from "../../model/types"

export function exportarSNIES(vigencia: number): Promise<Sincronizacion> {
  return fetcher(`/api/v1/integracion/snies?vigencia=${vigencia}`, { method: "POST" })
}