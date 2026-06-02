// features/integracion/sincronizaciones/ejecutar/api.ts

import { fetcher } from "@/shared/api/fetcher"
import type { EjecutarSincronizacionCommand, Sincronizacion } from "../../model/types"

export function ejecutarSincronizacion(
  command: EjecutarSincronizacionCommand
): Promise<Sincronizacion> {
  return fetcher("/api/v1/integracion/sincronizaciones", {
    method: "POST",
    body: JSON.stringify(command),
  })
}