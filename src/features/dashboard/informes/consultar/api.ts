import { fetcher } from "@/shared/api/fetcher"
import type { InformeSolicitado } from "../../model/types"

export function getEstadoInforme(id: string): Promise<InformeSolicitado> {
  return fetcher<InformeSolicitado>(`/api/v1/dashboard/informes/${id}`)
}

export function getTiposInforme(): Promise<{ tipo: string; nombre: string; descripcion: string }[]> {
  return fetcher<{ tipo: string; nombre: string; descripcion: string }[]>(
    "/api/v1/dashboard/informes/tipos",
  )
}
