import type { DashboardParams, EventosSeguimientoParams } from "./types"

export const dashboardKeys = {
  all: ["dashboard"] as const,

  // Resumen ejecutivo
  resumen: (p?: DashboardParams) =>
    [...dashboardKeys.all, "resumen", p] as const,
  kpis: (p?: DashboardParams) =>
    [...dashboardKeys.all, "kpis", p] as const,
  agenda: () =>
    [...dashboardKeys.all, "agenda"] as const,

  // Semáforo proyectos
  semaforo: (p?: DashboardParams) =>
    [...dashboardKeys.all, "semaforo", p] as const,

  // Alertas
  alertas: () => [...dashboardKeys.all, "alertas"] as const,
  alertasActivas: () => [...dashboardKeys.alertas(), "activas"] as const,
  alertaDetail: (id: number) => [...dashboardKeys.alertas(), "detail", id] as const,

  // Seguimiento
  eventos: () => [...dashboardKeys.all, "eventos"] as const,
  eventosList: (p?: EventosSeguimientoParams) =>
    [...dashboardKeys.eventos(), "list", p] as const,
  eventoDetail: (id: number) =>
    [...dashboardKeys.eventos(), "detail", id] as const,
  eventosVencidos: () =>
    [...dashboardKeys.eventos(), "vencidos"] as const,

  // Informes
  informes: () => [...dashboardKeys.all, "informes"] as const,
  informeDetail: (id: string) =>
    [...dashboardKeys.informes(), "detail", id] as const,
  informesTipos: () =>
    [...dashboardKeys.informes(), "tipos"] as const,
}
