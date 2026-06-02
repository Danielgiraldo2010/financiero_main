import { fetcher } from "@/shared/api/fetcher"
import type { ResumenSemaforo, DashboardParams } from "../model/types"

export function getEstadoProyectos(params?: DashboardParams): Promise<ResumenSemaforo> {
  const qs = new URLSearchParams()
  if (params?.vigencia) qs.set("vigencia", String(params.vigencia))
  return fetcher<ResumenSemaforo>(`/api/v1/dashboard/proyectos?${qs.toString()}`)
}
