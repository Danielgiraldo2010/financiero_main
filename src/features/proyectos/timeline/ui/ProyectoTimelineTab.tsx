// src/features/proyectos/timeline/ui/ProyectoTimelineTab.tsx
import { useProyectoTimeline } from '../hook'
import { ESTADO_PRESUPUESTO_LABEL, SEMAFORO_MAP, SEMAFORO_HEX } from '../../model/constants'
import type { TimelineItemProyecto } from '../../model/types'

// vigencia viene de proyecto.vigenciaActiva en ProyectoDetailPage
interface Props {
  proyectoId: number
  vigencia:   number
}

export function ProyectoTimelineTab({ proyectoId, vigencia }: Props) {
  const { data, isLoading, isError } = useProyectoTimeline(proyectoId, vigencia)

  if (isLoading) return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
      ))}
    </div>
  )

  if (isError) return (
    <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
      No se pudo cargar el historial de estados.
    </div>
  )

  if (!data || data.length === 0) return (
    <div className="rounded-lg border-2 border-dashed p-10 text-center text-sm text-muted-foreground">
      No hay cambios de estado registrados para este proyecto.
    </div>
  )

  return (
    <div className="relative space-y-0">
      {/* Línea vertical */}
      <div className="absolute left-5 top-5 bottom-5 w-px bg-border" aria-hidden="true" />

      {data.map((item: TimelineItemProyecto, idx: number) => {
        const color = SEMAFORO_MAP[item.estado]
        const hex   = SEMAFORO_HEX[color]
        const fecha = new Date(item.fechaEstado)
        const esMasReciente = idx === 0

        return (
          <div key={item.id} className="relative flex gap-4 pb-6">
            {/* Nodo */}
            <div
              className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 bg-background"
              style={{ borderColor: hex }}
            >
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: hex }} />
            </div>

            {/* Contenido */}
            <div className={[
              'flex-1 rounded-lg border p-3',
              esMasReciente ? 'bg-card shadow-sm' : 'bg-background',
            ].join(' ')}>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-sm font-medium" style={{ color: hex }}>
                  {ESTADO_PRESUPUESTO_LABEL[item.estado]}
                </span>
                {esMasReciente && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    Estado actual
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {fecha.toLocaleDateString('es-CO', {
                  year: 'numeric', month: 'long', day: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Por: <span className="font-medium text-foreground">{item.usuario}</span>
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Vigencia {item.vigencia}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
