import { useVigencia } from '@/shared/hooks/useVigencia'
import { useResumenPresupuesto } from '../hook'
import { LoadingSpinner } from '@/shared/ui/feedback/LoadingSpinner'
import { ErrorMessage } from '@/shared/ui/feedback/ErrorMessage'
import { StatusBadge } from '@/shared/ui/feedback/StatusBadge'
import { formatCOP } from '@/shared/lib/currency'
import { cn } from '@/shared/lib/cn'
import {
  BadgeDollarSign,
  Building2,
  Landmark,
  WalletCards,
  type LucideIcon,
} from 'lucide-react'

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
  label: string
  value: string
  sub?: string
  highlight?: boolean
  icon: LucideIcon
  progress?: number
}

function MetricCard({ label, value, sub, highlight, icon: Icon, progress }: MetricCardProps) {
  const progressValue = progress === undefined ? undefined : Math.max(4, Math.min(progress, 100))

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-[16px] border border-[rgba(15,23,42,0.08)] bg-white p-5 shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition-all duration-200 ease-out hover:border-[#004b82]/25 hover:shadow-[0_8px_18px_rgba(15,23,42,0.10)]',
        highlight && 'border-destructive/35 bg-destructive/5'
      )}
    >
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#607086]">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-[-0.045em] text-[#0f2f4f] tabular-nums">{value}</p>
        </div>
        <div className="rounded-[16px] border border-[#004b82]/18 bg-[#edf4fb] p-3 text-[#004b82] shadow-[0_10px_24px_rgba(0,75,130,0.12)]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      {sub && <p className="relative mt-3 text-sm font-medium leading-5 text-[#5b6b7f]">{sub}</p>}
      {progressValue !== undefined && (
        <div className="relative mt-4 h-2.5 overflow-hidden rounded-full bg-[#dbe8f4] shadow-[inset_0_1px_2px_rgba(0,75,130,0.10)]">
          <div className="h-full rounded-full bg-[#004b82]" style={{ width: `${progressValue}%` }} />
        </div>
      )}
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
    <div className="space-y-5">
      <div className="flex items-center justify-between border-l-4 border-[#d5bb87] px-4 py-2.5">
        <h2 className="text-2xl font-bold tracking-[-0.025em] text-[#004b82]">Resumen Ejecución — Vigencia {data.vigencia}</h2>
        <StatusBadge label={badge.label} variant={badge.variant} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Presupuesto Ingresos"
          value={formatCOP(data.totalPresupuestoIngresos)}
          sub={`Ejecutado: ${formatCOP(data.totalEjecutadoIngresos)} (${pctI}%)`}
          progress={Number(data.porcentajeEjecucionIngresos)}
          icon={Landmark} />
        <MetricCard label="Presupuesto Gastos"
          value={formatCOP(data.totalPresupuestoGastos)}
          sub={`Ejecutado: ${formatCOP(data.totalEjecutadoGastos)} (${pctG}%)`}
          progress={Number(data.porcentajeEjecucionGastos)}
          icon={WalletCards} />
        <MetricCard label="Saldo Disponible Gastos"
          value={formatCOP(data.saldoDisponibleGastos)}
          highlight={data.saldoDisponibleGastos < 0}
          progress={data.totalPresupuestoGastos > 0 ? (data.saldoDisponibleGastos / data.totalPresupuestoGastos) * 100 : 0}
          icon={BadgeDollarSign} />
        <MetricCard label="Unidad Ejecutora"
          value={data.unidadEjecutora}
          sub={`ID: ${data.unidadEjecutoraId}`}
          progress={100}
          icon={Building2} />
      </div>
    </div>
  )
}
