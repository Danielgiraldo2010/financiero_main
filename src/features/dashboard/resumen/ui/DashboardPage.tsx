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
    <div className="space-y-5">
      <PageHeader
        title="Dashboard"
        description={`Resumen financiero — vigencia ${vigenciaActiva}`}
        actions={
          <Link
            to="/dashboard/informes"
            className="inline-flex h-10 items-center gap-2 rounded-[12px] border border-[#004b82] bg-white px-4 text-sm font-semibold text-[#004b82] shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition-all duration-200 ease-out hover:bg-[#edf4fb] hover:shadow-[0_8px_18px_rgba(15,23,42,0.10)]"
          >
            Informes
          </Link>
        }
      />

      {/* KPI cards */}
      {loadingResumen ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-[16px] border border-[rgba(15,23,42,0.08)] bg-[#edf4fb] shadow-[0_4px_12px_rgba(15,23,42,0.08)]" />
          ))}
        </div>
      ) : resumen ? (
        <ResumenCards resumen={resumen} />
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
        {/* Gráfica de ejecución */}
        <div>{resumen && <EjecucionChart resumen={resumen} />}</div>

        {/* Paneles operativos */}
        <div className="grid gap-5">
          <AlertasActivasPanel maxItems={5} />
          <AgendaWidget eventos={agenda} />
        </div>
      </div>

      {/* Semáforo proyectos */}
      <section className="overflow-hidden rounded-[16px] border border-[rgba(15,23,42,0.08)] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-3 border-b border-[#dbe8f4] bg-[linear-gradient(90deg,rgba(237,244,251,0.92),rgba(255,255,255,1))] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-[-0.03em] text-[#004b82]">Estado de proyectos</h2>
            <p className="mt-1 text-sm font-medium text-muted-foreground">Seguimiento ejecutivo de avance presupuestal por proyecto.</p>
          </div>
          {semaforo && (
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-muted-foreground">
              <span className="flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-green-800">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                {semaforo.verde} en ejecucion
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1.5 text-yellow-800">
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                {semaforo.amarillo} en proceso
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-red-800">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                {semaforo.rojo} sin presupuesto
              </span>
            </div>
          )}
        </div>
        <div className="p-5">
        {loadingSemaforo ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-[16px] border border-[rgba(15,23,42,0.08)] bg-[#edf4fb]" />
            ))}
          </div>
        ) : semaforo ? (
          <SemaforoProyectosGrid proyectos={semaforo.proyectos} />
        ) : null}
        </div>
      </section>
    </div>
  )
}
