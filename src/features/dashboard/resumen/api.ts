import { fetcher } from "@/shared/api/fetcher"
import type { ResumenEjecutivo, KPIDashboard, EventoAgenda, DashboardParams } from "../model/types"

export function getResumenEjecutivo(params?: DashboardParams): Promise<ResumenEjecutivo> {
  const qs = new URLSearchParams()
  if (params?.vigencia) qs.set("vigencia", String(params.vigencia))
  return fetcher<ResumenEjecutivo>(`/api/v1/dashboard/resumen?${qs.toString()}`)
}

export function getKPIs(params?: DashboardParams): Promise<KPIDashboard[]> {
  const qs = new URLSearchParams()
  if (params?.vigencia) qs.set("vigencia", String(params.vigencia))
  return fetcher<KPIDashboard[]>(`/api/v1/dashboard/kpis?${qs.toString()}`)
}

export function getAgenda(): Promise<{ items: EventoAgenda[] }> {
  return fetcher<{ items: EventoAgenda[] }>("/api/v1/dashboard/agenda")
}
