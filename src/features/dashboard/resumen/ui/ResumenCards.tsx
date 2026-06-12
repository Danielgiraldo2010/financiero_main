import type { ResumenEjecutivo } from "../../model/types"
import {
  BarChart3,
  Clock3,
  FileCheck2,
  TrendingUp,
  type LucideIcon,
} from "lucide-react"

interface Props {
  resumen: ResumenEjecutivo
}

function formatCOP(n: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

function PctBar({ pct }: { pct: number }) {
  const width = Math.max(4, Math.min(pct, 100))
  return (
    <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-[#dbe8f4] shadow-[inset_0_1px_2px_rgba(0,75,130,0.10)]">
      <div
        className="h-full rounded-full bg-[#004b82] shadow-[0_0_18px_rgba(0,75,130,0.34)]"
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

function KPICard({
  label,
  value,
  sub,
  pct,
  icon: Icon,
}: {
  label: string
  value: string
  sub?: string
  pct?: number
  icon: LucideIcon
}) {
  return (
    <div className="group relative overflow-hidden rounded-[16px] border border-[rgba(15,23,42,0.08)] bg-white p-5 shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition-all duration-200 ease-out hover:border-[#004b82]/25 hover:shadow-[0_8px_18px_rgba(15,23,42,0.10)]">
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#607086]">{label}</p>
          <p className="mt-3 text-4xl font-bold tracking-[-0.05em] text-[#0f2f4f] tabular-nums">{value}</p>
        </div>
        <div className="rounded-[16px] border border-[#004b82]/18 bg-[#edf4fb] p-3 text-[#004b82] shadow-[0_10px_24px_rgba(0,75,130,0.12)]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      {sub && <p className="relative mt-3 line-clamp-2 text-sm font-medium leading-5 text-[#5b6b7f]">{sub}</p>}
      {pct !== undefined && (
        <div className="relative">
          <PctBar pct={pct} />
          <div className="mt-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.12em] text-[#607086]">
            <span>Avance</span>
            <span>{Math.min(Math.max(pct, 0), 100).toFixed(1)}%</span>
          </div>
        </div>
      )}
    </div>
  )
}

export function ResumenCards({ resumen }: Props) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <KPICard
        label="Ejecucion Ingresos"
        value={`${resumen.porcentajeEjecucionIngresos.toFixed(1)}%`}
        sub={`${formatCOP(resumen.totalEjecutadoIngresos)} / ${formatCOP(resumen.totalPresupuestoIngresos)}`}
        pct={resumen.porcentajeEjecucionIngresos}
        icon={TrendingUp}
      />
      <KPICard
        label="Ejecucion Gastos"
        value={`${resumen.porcentajeEjecucionGastos.toFixed(1)}%`}
        sub={`${formatCOP(resumen.totalEjecutadoGastos)} / ${formatCOP(resumen.totalPresupuestoGastos)}`}
        pct={resumen.porcentajeEjecucionGastos}
        icon={BarChart3}
      />
      <KPICard
        label="SAR Pendientes"
        value={String(resumen.sarPendientes)}
        sub="Solicitudes sin procesar"
        pct={Math.min(resumen.sarPendientes * 10, 100)}
        icon={Clock3}
      />
      <KPICard
        label="CDP Pendientes"
        value={String(resumen.cdpPendientes)}
        sub={`${resumen.proyectosActivos} proyectos activos`}
        pct={Math.min(resumen.cdpPendientes * 10, 100)}
        icon={FileCheck2}
      />
    </div>
  )
}
