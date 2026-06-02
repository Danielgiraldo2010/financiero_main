import { fetcher } from "@/shared/api/fetcher"
import type { SolicitudInforme, InformeSolicitado } from "../../model/types"

// Responde 202 Accepted con el informe en estado PENDIENTE
export function solicitarInforme(solicitud: SolicitudInforme): Promise<InformeSolicitado> {
  return fetcher<InformeSolicitado>("/api/v1/dashboard/informes", {
    method: "POST",
    body: JSON.stringify(solicitud),
  })
}
