import type { ResumenEjecutivo } from "../../model/types"

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
  const color = pct >= 80 ? "bg-green-500" : pct >= 50 ? "bg-yellow-400" : "bg-red-500"
  return (
    <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
      <div
        className={`h-1.5 rounded-full transition-all ${color}`}
        style={{ width: `${Math.min(pct, 100)}%` }}
      />
    </div>
  )
}

function KPICard({
  label,
  value,
  sub,
  pct,
  colorPct,
}: {
  label: string
  value: string
  sub?: string
  pct?: number
  colorPct?: string
}) {
  return (
    <div className="rounded-lg border bg-background p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
      {sub && <p className="mt-0.5 text-sm text-muted-foreground">{sub}</p>}
      {pct !== undefined && <PctBar pct={pct} />}
    </div>
  )
}

export function ResumenCards({ resumen }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KPICard
        label="Ejecucion Ingresos"
        value={`${resumen.porcentajeEjecucionIngresos.toFixed(1)}%`}
        sub={`${formatCOP(resumen.totalEjecutadoIngresos)} / ${formatCOP(resumen.totalPresupuestoIngresos)}`}
        pct={resumen.porcentajeEjecucionIngresos}
      />
      <KPICard
        label="Ejecucion Gastos"
        value={`${resumen.porcentajeEjecucionGastos.toFixed(1)}%`}
        sub={`${formatCOP(resumen.totalEjecutadoGastos)} / ${formatCOP(resumen.totalPresupuestoGastos)}`}
        pct={resumen.porcentajeEjecucionGastos}
      />
      <KPICard
        label="SAR Pendientes"
        value={String(resumen.sarPendientes)}
        sub="Solicitudes sin procesar"
      />
      <KPICard
        label="CDP Pendientes"
        value={String(resumen.cdpPendientes)}
        sub={`${resumen.proyectosActivos} proyectos activos`}
      />
    </div>
  )
}
