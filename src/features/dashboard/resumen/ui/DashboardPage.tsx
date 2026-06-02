import { useUIStore } from "@/shared/state/ui.store"
import { useResumenEjecutivo, useAgenda } from "../hook"
import { useEstadoProyectos } from "../../proyectos-semaforo/hook"
import { ResumenCards } from "./ResumenCards"
import { EjecucionChart } from "./EjecucionChart"
import { AgendaWidget } from "./AgendaWidget"
import { SemaforoProyectosGrid } from "../../proyectos-semaforo/ui/SemaforoProyectosGrid"
import { AlertasActivasPanel } from "../../alertas/listar/ui/AlertasActivasPanel"
import { PageHeader } from "@/shared/ui/layout/PageHeader"
import { Link } from "@tanstack/react-router"

export function DashboardPage() {
  const vigenciaActiva = useUIStore((s) => s.vigenciaActiva)
  const params = { vigencia: vigenciaActiva }

  const { data: resumen, isLoading: loadingResumen } = useResumenEjecutivo(params)
  const { data: semaforo, isLoading: loadingSemaforo } = useEstadoProyectos(params)
  const { data: agendaData } = useAgenda()
  const agenda = agendaData?.items ?? []

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Dashboard"
        description={`Resumen financiero — vigencia ${vigenciaActiva}`}
        actions={
          <Link
            to="/dashboard/informes"
            className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-muted"
          >
            Informes
          </Link>
        }
      />

      {/* KPI cards */}
      {loadingResumen ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-lg border bg-muted animate-pulse" />
          ))}
        </div>
      ) : resumen ? (
        <ResumenCards resumen={resumen} />
      ) : null}

      {/* Gráfica de ejecución */}
      {resumen && <EjecucionChart resumen={resumen} />}

      {/* Layout de 2 columnas: alertas + agenda */}
      <div className="grid gap-4 lg:grid-cols-2">
        <AlertasActivasPanel maxItems={5} />
        <AgendaWidget eventos={agenda} />
      </div>

      {/* Semáforo proyectos */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">Estado de proyectos</h2>
          {semaforo && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                {semaforo.verde} en ejecucion
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                {semaforo.amarillo} en proceso
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                {semaforo.rojo} sin presupuesto
              </span>
            </div>
          )}
        </div>
        {loadingSemaforo ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-36 rounded-lg border bg-muted animate-pulse" />
            ))}
          </div>
        ) : semaforo ? (
          <SemaforoProyectosGrid proyectos={semaforo.proyectos} />
        ) : null}
      </div>
    </div>
  )
}
