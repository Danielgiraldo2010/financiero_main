import { useVigencia } from '@/shared/hooks/useVigencia'
import { useResumenPresupuesto } from '../hook'
import { LoadingSpinner } from '@/shared/ui/feedback/LoadingSpinner'
import { ErrorMessage } from '@/shared/ui/feedback/ErrorMessage'
import { StatusBadge } from '@/shared/ui/feedback/StatusBadge'
import { formatCOP } from '@/shared/lib/currency'
import { cn } from '@/shared/lib/cn'

function estadoBadge(estado: string): { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'default' } {
  const map: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
    EN_EJECUCION:        { label: 'En Ejecución',        variant: 'success' },
    APROBADO_PLANEACION: { label: 'Aprobado Planeación', variant: 'success' },
    CONSOLIDADO:         { label: 'Consolidado',         variant: 'info'    },
    BORRADOR:            { label: 'Borrador',            variant: 'default' },
  }
  return map[estado] ?? { label: estado, variant: 'default' }
}

interface MetricCardProps {
  label: string; value: string; sub?: string; highlight?: boolean
}

function MetricCard({ label, value, sub, highlight }: MetricCardProps) {
  return (
    <div className={cn('rounded-lg border p-4 space-y-1',
      highlight && 'border-destructive bg-destructive/5')}>
      <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  )
}

export function ResumenPresupuestoPanel() {
  const { vigenciaActiva: vigencia } = useVigencia()
  const { data, isLoading, isError } = useResumenPresupuesto(vigencia)

  if (isLoading) return <LoadingSpinner />
  if (isError)   return <ErrorMessage message="No se pudo cargar el resumen presupuestal." />
  if (!data)     return null

  const badge = estadoBadge(data.estadoActual)
  const pctI = Number(data.porcentajeEjecucionIngresos).toFixed(1)
  const pctG = Number(data.porcentajeEjecucionGastos).toFixed(1)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Resumen Ejecución — Vigencia {data.vigencia}</h2>
        <StatusBadge label={badge.label} variant={badge.variant} />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard label="Presupuesto Ingresos"
          value={formatCOP(data.totalPresupuestoIngresos)}
          sub={`Ejecutado: ${formatCOP(data.totalEjecutadoIngresos)} (${pctI}%)`} />
        <MetricCard label="Presupuesto Gastos"
          value={formatCOP(data.totalPresupuestoGastos)}
          sub={`Ejecutado: ${formatCOP(data.totalEjecutadoGastos)} (${pctG}%)`} />
        <MetricCard label="Saldo Disponible Gastos"
          value={formatCOP(data.saldoDisponibleGastos)}
          highlight={data.saldoDisponibleGastos < 0} />
        <MetricCard label="Unidad Ejecutora"
          value={data.unidadEjecutora}
          sub={`ID: ${data.unidadEjecutoraId}`} />
      </div>
    </div>
  )
}
