import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useProyectos } from '../hook'
import { useAnularProyecto } from '../../anular/hook'
import { ProyectosFilters } from './ProyectosFilters'
import { ProyectoSemaforoCard } from './ProyectoSemaforoCard'
import { RegistrarProyectoDialog } from '../../registrar/ui/RegistrarProyectoDialog'
import type { ListarProyectosParams, Proyecto } from '../../model/types'
import { useUnidadesEjecutoras } from '@/features/catalogos/unidades-ejecutoras/listar/hook'
import { useProgramasAcademicos } from '@/features/catalogos/programas-academicos/listar/hook'

export function ProyectosPage() {
  const [params, setParams]             = useState<ListarProyectosParams>({ Pagina: 1, TamanoPagina: 20 })
  const [anularTarget, setAnularTarget] = useState<Proyecto | null>(null)
  const [motivo, setMotivo]             = useState('')
  const [registrarOpen, setRegistrarOpen] = useState(false)

  const { data, isLoading, isError } = useProyectos(params)
  const anular = useAnularProyecto()

  // tiposProyecto eliminado — lo carga RegistrarProyectoDialog internamente
  const { data: ueData } = useUnidadesEjecutoras({ elementosPorPagina: 200 })
  const unidadesEjecutoras = ueData?.items ?? []
  const { data: paData } = useProgramasAcademicos({ elementosPorPagina: 200 })
  const programasAcademicos = paData?.items ?? []

  function mergeParams(patch: Partial<ListarProyectosParams>) {
    setParams((prev) => ({ ...prev, ...patch }))
  }

  function cerrarAnular() {
    setAnularTarget(null)
    setMotivo('')
  }

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/" className="hover:underline">Inicio</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Proyectos especiales</span>
      </nav>

      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Proyectos especiales</h1>
          {data && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {data.totalRegistros} {data.totalRegistros === 1 ? 'proyecto' : 'proyectos'}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setRegistrarOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
          </svg>
          Nuevo proyecto
        </button>
      </div>

      {/* Filtros */}
      <ProyectosFilters value={params} onChange={mergeParams} />

      {/* Contenido */}
      {isLoading && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 rounded-lg border bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          No se pudieron cargar los proyectos. Intente nuevamente.
        </div>
      )}

      {data && data.items.length === 0 && (
        <div className="rounded-lg border-2 border-dashed p-12 text-center">
          <p className="text-muted-foreground">No se encontraron proyectos con los filtros actuales.</p>
        </div>
      )}

      {data && data.items.length > 0 && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((p) => (
              <ProyectoSemaforoCard
                key={p.id}
                proyecto={p}
                onAnular={setAnularTarget}
              />
            ))}
          </div>

          {data.totalRegistros > (params.TamanoPagina ?? 20) && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Página {params.Pagina ?? 1} de{' '}
                {Math.ceil(data.totalRegistros / (params.TamanoPagina ?? 20))}
              </p>
              <div className="flex gap-2">
                <button type="button"
                  disabled={(params.Pagina ?? 1) <= 1}
                  className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-40"
                  onClick={() => mergeParams({ Pagina: (params.Pagina ?? 1) - 1 })}>
                  Anterior
                </button>
                <button type="button"
                  disabled={(params.Pagina ?? 1) >= Math.ceil(data.totalRegistros / (params.TamanoPagina ?? 20))}
                  className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-40"
                  onClick={() => mergeParams({ Pagina: (params.Pagina ?? 1) + 1 })}>
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <RegistrarProyectoDialog
        open={registrarOpen}
        onClose={() => setRegistrarOpen(false)}
        unidadesEjecutoras={unidadesEjecutoras}
        programasAcademicos={programasAcademicos}
      />

      {/* Dialog de anulación */}
      {anularTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-semibold">Anular proyecto</h2>
            <p className="text-sm text-muted-foreground">
              ¿Confirma que desea anular el proyecto{' '}
              <strong>"{anularTarget.nombre}"</strong>?
              Esta acción no se puede deshacer.
            </p>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="motivo-anular-lista">
                Motivo de anulación <span className="text-destructive">*</span>
              </label>
              <textarea
                id="motivo-anular-lista"
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
                onClick={cerrarAnular}
                className="rounded-md border px-4 py-2 text-sm hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={motivo.trim().length === 0 || anular.isPending}
                onClick={async () => {
                  await anular.mutateAsync({ id: anularTarget.id, motivo: motivo.trim() })
                  cerrarAnular()
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
