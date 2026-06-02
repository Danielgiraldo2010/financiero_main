import { useState } from 'react'
import { PageHeader } from '@/shared/ui/layout/PageHeader'
import { SelectField } from '@/shared/ui/forms/SelectField'
import { formatCOP } from '@/shared/lib/currency'
import { usePlanClases } from '../hook'
import { RegistrarPlanClasesDialog } from '../../registrar/ui/RegistrarPlanClasesDialog'
import { CerrarPlanClasesDialog } from '../../cerrar/ui/CerrarPlanClasesDialog'
import { HorasTable } from '../../../horas-dictadas/listar/ui/HorasTable'
import type { PlanClases } from '../../../model/types'

const ESTADO_OPTIONS = [
  { value: '',        label: 'Todos' },
  { value: 'ABIERTO', label: 'Abierto' },
  { value: 'CERRADO', label: 'Cerrado' },
]

export function PlanClasesPage() {
  const [estadoFiltro, setEstadoFiltro]       = useState('')
  const [openRegistrar, setOpenRegistrar]     = useState(false)
  const [planACerrar, setPlanACerrar]         = useState<PlanClases | null>(null)
  const [expandedPlan, setExpandedPlan]       = useState<number | null>(null)

  const { data, isLoading, isError } = usePlanClases(
    estadoFiltro ? { estado: estadoFiltro } : undefined,
  )

  const toggleExpand = (id: number) =>
    setExpandedPlan((prev) => (prev === id ? null : id))

  return (
    <div className="space-y-4">
      <PageHeader
        title="Plan de Clases"
        actions={
          <button className="btn-primary" onClick={() => setOpenRegistrar(true)}>
            Registrar
          </button>
        }
      />

      <div className="w-44">
        <SelectField
          label="Estado"
          options={ESTADO_OPTIONS}
          value={estadoFiltro}
          onChange={setEstadoFiltro}
        />
      </div>

      {isLoading && <p className="text-sm text-muted">Cargando…</p>}
      {isError && (
        <p className="text-sm text-red-600">Error al cargar plan de clases.</p>
      )}

      {data && (
        <div className="space-y-2">
          {data.items.map((plan) => (
            <div
              key={plan.id}
              className="rounded-md border border-gray-200 bg-white"
            >
              {/* Fila principal */}
              <div className="grid grid-cols-[1fr_1fr_1fr_auto_auto_auto] gap-4 items-center px-4 py-3 text-sm">
                <div>
                  <p className="font-medium">{plan.asignatura}</p>
                  <p className="text-xs text-muted">{plan.empleadoNombre}</p>
                </div>
                <div>
                  <p>{plan.periodoNombre}</p>
                  <p className="text-xs text-muted">{plan.programaNombre} · {plan.nivelPrograma}</p>
                </div>
                <div>
                  <p>{plan.horasSemanales}h/sem × {plan.semanas} sem = {plan.totalHoras}h</p>
                  <p className="text-xs text-muted">
                    {formatCOP(plan.valorHora)}/h · Total: {formatCOP(plan.valorTotal)}
                  </p>
                </div>
                <span className={
                  plan.estado === 'ABIERTO' ? 'badge-success' : 'badge-neutral'
                }>
                  {plan.estado}
                </span>
                {plan.estado === 'ABIERTO' && (
                  <button
                    className="btn-ghost text-xs text-amber-700"
                    onClick={() => setPlanACerrar(plan)}
                  >
                    Cerrar
                  </button>
                )}
                <button
                  className="btn-ghost text-xs"
                  onClick={() => toggleExpand(plan.id)}
                >
                  {expandedPlan === plan.id ? '▲ Ocultar' : '▼ Horas'}
                </button>
              </div>

              {/* Subtabla horas dictadas (07b-I5) */}
              {expandedPlan === plan.id && (
                <div className="border-t border-gray-100 px-4 pb-3 pt-2">
                  <HorasTable planClasesId={plan.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <RegistrarPlanClasesDialog
        open={openRegistrar}
        onClose={() => setOpenRegistrar(false)}
      />

      {planACerrar && (
        <CerrarPlanClasesDialog
          planClasesId={planACerrar.id}
          asignatura={planACerrar.asignatura}
          open={planACerrar !== null}
          onClose={() => setPlanACerrar(null)}
        />
      )}
    </div>
  )
}
