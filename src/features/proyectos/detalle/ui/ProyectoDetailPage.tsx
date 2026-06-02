// src/features/proyectos/detalle/ui/ProyectoDetailPage.tsx
import { lazy, Suspense, useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { ConfirmDialog } from '@/shared/ui/overlays/ConfirmDialog'
import { DocumentosPanel } from '@/features/documentos/entity/ui/DocumentosPanel'
import { useProyecto } from '../hook'
import { useAnularProyecto } from '../../anular/hook'
import { ProyectoHeader } from './ProyectoHeader'
import { PROYECTO_TABS } from '../../model/constants'
import type { ProyectoTab } from '../../model/constants'
import { useRubrosIngreso } from '@/features/catalogos/rubros-ingreso/listar/hook'
import { useRubrosGasto } from '@/features/catalogos/rubros-gasto/listar/hook'
import { useFuentesRecursos } from '@/features/catalogos/fuentes-recursos/listar/hook'

const ModificarProyectoDialog = lazy(
  () => import('../../modificar/ui/ModificarProyectoDialog').then((m) => ({ default: m.ModificarProyectoDialog }))
)
const ProyectoTimelineTab = lazy(
  () => import('../../timeline/ui/ProyectoTimelineTab').then((m) => ({ default: m.ProyectoTimelineTab }))
)
const PresupuestoProyectoTab = lazy(
  () => import('../../presupuesto/lineas/ui/PresupuestoProyectoTab').then((m) => ({ default: m.PresupuestoProyectoTab }))
)
const ContratosTab = lazy(
  () => import('../../contratos/ui/ContratosTab').then((m) => ({ default: m.ContratosTab }))
)
const CarteraTab = lazy(
  () => import('../../cartera/ui/CarteraTab').then((m) => ({ default: m.CarteraTab }))
)

const TabSkeleton = () => <div className="h-64 animate-pulse rounded-lg bg-muted" />

export function ProyectoDetailPage() {
  const { id } = useParams({ from: '/_authenticated/proyectos/$id' })
  const proyectoId = Number(id)

  const [tab, setTab]               = useState<ProyectoTab>('info')
  const [editOpen, setEditOpen]     = useState(false)
  const [anularOpen, setAnularOpen] = useState(false)
  const [motivo, setMotivo]         = useState('')

  const { data: proyecto, isLoading, isError } = useProyecto(proyectoId)
  const anular = useAnularProyecto()

  const { data: rubrosIngresoData }  = useRubrosIngreso({ elementosPorPagina: 200 })
  const { data: rubrosGastoData }    = useRubrosGasto({ elementosPorPagina: 200 })
  const { data: fuentesRecursoData } = useFuentesRecursos({ elementosPorPagina: 200 })

  const rubrosIngreso  = rubrosIngresoData?.items  ?? []
  const rubrosGasto    = rubrosGastoData?.items    ?? []
  const fuentesRecurso = fuentesRecursoData?.items ?? []

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-36 rounded-lg bg-muted" />
        <div className="h-10 rounded-lg bg-muted" />
        <div className="h-64 rounded-lg bg-muted" />
      </div>
    )
  }

  if (isError || !proyecto) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        No se pudo cargar el proyecto. Verifique el ID o intente nuevamente.
      </div>
    )
  }

  const vigencia = proyecto.vigenciaActiva ?? new Date().getFullYear()

  return (
    <div className="space-y-5">
      <ProyectoHeader
        proyecto={proyecto}
        onModificar={() => setEditOpen(true)}
        onAnular={() => setAnularOpen(true)}
      />

      <div className="border-b">
        <div className="flex overflow-x-auto gap-1 -mb-px">
          {PROYECTO_TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTab(t.value)}
              className={[
                'shrink-0 border-b-2 px-4 py-2 text-sm font-medium transition-colors',
                tab === t.value
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        {tab === 'info' && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem label="Código"           value={proyecto.codigo} />
            <InfoItem label="Tipo de proyecto" value={proyecto.tipoProyectoNombre} />
            <InfoItem label="Unidad ejecutora" value={proyecto.unidadEjecutoraNombre} />
            <InfoItem label="Vigencia"         value={String(proyecto.vigenciaActiva)} />
            {proyecto.programaAcademicoNombre && (
              <InfoItem label="Programa académico" value={proyecto.programaAcademicoNombre} />
            )}
            {proyecto.nivelPrograma && (
              <InfoItem label="Nivel" value={proyecto.nivelPrograma} />
            )}
            {proyecto.fechaInicio && (
              <InfoItem label="Fecha inicio" value={proyecto.fechaInicio} />
            )}
            {proyecto.fechaFin && (
              <InfoItem label="Fecha fin" value={proyecto.fechaFin} />
            )}
            <InfoItem
              label="Valor total"
              value={new Intl.NumberFormat('es-CO', {
                style: 'currency', currency: 'COP', maximumFractionDigits: 0,
              }).format(proyecto.valorTotal)}
            />
          </div>
        )}

        {tab === 'presupuesto' && (
          <Suspense fallback={<TabSkeleton />}>
            <PresupuestoProyectoTab
              proyecto={proyecto}
              rubrosIngreso={rubrosIngreso}
              rubrosGasto={rubrosGasto}
              fuentesRecurso={fuentesRecurso}
            />
          </Suspense>
        )}

        {tab === 'contratos' && (
          <Suspense fallback={<TabSkeleton />}>
            <ContratosTab
              proyectoId={proyectoId}
              unidadEjecutoraId={proyecto.unidadEjecutoraId}
              vigencia={vigencia}
              rubrosGasto={rubrosGasto}
              fuentesRecurso={fuentesRecurso}
            />
          </Suspense>
        )}

        {tab === 'cartera' && (
          <Suspense fallback={<TabSkeleton />}>
            <CarteraTab
              proyectoId={proyectoId}
              unidadEjecutoraId={proyecto.unidadEjecutoraId}
              vigencia={vigencia}
              rubrosIngreso={rubrosIngreso}
            />
          </Suspense>
        )}

        {tab === 'documentos' && (
          <DocumentosPanel entidadTipo="PROYECTO" entidadId={proyectoId} />
        )}

        {tab === 'timeline' && (
          <Suspense fallback={<TabSkeleton />}>
            <ProyectoTimelineTab
              proyectoId={proyectoId}
              vigencia={vigencia}
            />
          </Suspense>
        )}
      </div>

      <Suspense>
        {editOpen && (
          <ModificarProyectoDialog
            open={editOpen}
            proyecto={proyecto}
            onClose={() => setEditOpen(false)}
          />
        )}
      </Suspense>

      {/* Dialog de anulación con campo de motivo requerido */}
      {anularOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-semibold">Anular proyecto</h2>
            <p className="text-sm text-muted-foreground">
              ¿Confirma que desea anular el proyecto{' '}
              <strong>"{proyecto.nombre}"</strong>?
              Esta acción no se puede deshacer.
            </p>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="motivo-anular">
                Motivo de anulación <span className="text-destructive">*</span>
              </label>
              <textarea
                id="motivo-anular"
                rows={3}
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Describa el motivo de la anulación..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-destructive/40"
              />
              {motivo.trim().length === 0 && (
                <p className="text-xs text-muted-foreground">El motivo es obligatorio para continuar.</p>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => { setAnularOpen(false); setMotivo('') }}
                className="rounded-md border px-4 py-2 text-sm hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={motivo.trim().length === 0 || anular.isPending}
                onClick={async () => {
                  await anular.mutateAsync({ id: proyectoId, motivo: motivo.trim() })
                  setAnularOpen(false)
                  setMotivo('')
                }}
                className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 transition-colors"
              >
                {anular.isPending ? 'Anulando...' : 'Confirmar anulación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{value}</p>
    </div>
  )
}
