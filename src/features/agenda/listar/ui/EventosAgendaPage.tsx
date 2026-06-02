import { useState } from "react"
import { useEventosAgenda } from "../hook"
import { PageHeader } from "@/shared/ui/layout/PageHeader"
import { CrearEventoDialog } from "../../crear/ui/CrearEventoDialog"
import { CompletarEventoDialog } from "../../completar/ui/CompletarEventoDialog"
import { CancelarEventoDialog } from "../../cancelar/ui/CancelarEventoDialog"
import { ActualizarEventoDialog } from "../../actualizar/ui/ActualizarEventoDialog"
import {
  SEMAFORO_ESTADO,
  LABEL_ESTADO,
} from "../../model/constants"
import type { AgendaEventoResponse } from "../../model/types"

export function EventosAgendaPage() {
  const [pagina, setPagina] = useState(1)
  const { data, isLoading, isError } = useEventosAgenda({ pagina, elementosPorPagina: 20 })

  const eventos = data?.items ?? []
  const totalPaginas = data?.totalPaginas ?? 1

  const [crearOpen, setCrearOpen] = useState(false)
  const [completar, setCompletar] = useState<AgendaEventoResponse | null>(null)
  const [cancelar, setCancelar] = useState<AgendaEventoResponse | null>(null)
  const [editar, setEditar] = useState<AgendaEventoResponse | null>(null)

  if (isLoading) return <p className="text-sm text-muted-foreground p-6">Cargando...</p>
  if (isError) return <p className="text-sm text-destructive p-6">Error al cargar eventos.</p>

  return (
    <div className="space-y-4">
      <PageHeader
        title="Gestion de Eventos"
        description="Administre los eventos presupuestales de la unidad"
        actions={
          <button
            className="btn-primary text-sm"
            onClick={() => setCrearOpen(true)}
          >
            + Nuevo evento
          </button>
        }
      />

      {eventos.length === 0 && (
        <p className="text-sm text-muted-foreground">No hay eventos registrados.</p>
      )}

      <div className="space-y-2">
        {eventos.map((ev: AgendaEventoResponse) => {
          const estadoClass = SEMAFORO_ESTADO[ev.estado] ?? "text-gray-600 bg-gray-100"
          const completado = ev.estado === "COMPLETADO"
          const cancelado = ev.estado === "CANCELADO"
          return (
            <div key={ev.id} className="border rounded-lg p-4 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{ev.titulo}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${estadoClass}`}>
                    {LABEL_ESTADO[ev.estado] ?? ev.estado}
                  </span>
                  {ev.prioridad === "ALTA" && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700">
                      Alta prioridad
                    </span>
                  )}
                </div>
                {ev.descripcion && (
                  <p className="text-xs text-muted-foreground mt-0.5">{ev.descripcion}</p>
                )}
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <span>Inicio: {new Date(ev.fechaInicio).toLocaleDateString("es-CO")}</span>
                  {ev.fechaLimite && (
                    <span className="text-red-600 font-medium">
                      Limite: {new Date(ev.fechaLimite).toLocaleDateString("es-CO")}
                    </span>
                  )}
                  <span>{ev.unidadEjecutoraNombre ?? "—"}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {!completado && !cancelado && (
                  <>
                    <button
                      className="text-xs text-blue-600 hover:underline"
                      onClick={() => setEditar(ev)}
                    >
                      Editar
                    </button>
                    <button
                      className="text-xs text-green-600 hover:underline"
                      onClick={() => setCompletar(ev)}
                    >
                      Completar
                    </button>
                    <button
                      className="text-xs text-red-600 hover:underline"
                      onClick={() => setCancelar(ev)}
                    >
                      Cancelar
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {totalPaginas > 1 && (
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            className="btn-secondary text-xs"
            onClick={() => setPagina((p) => Math.max(1, p - 1))}
            disabled={pagina === 1}
          >
            Anterior
          </button>
          <span className="text-xs text-muted-foreground">
            Pagina {pagina} de {totalPaginas}
          </span>
          <button
            className="btn-secondary text-xs"
            onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
            disabled={pagina === totalPaginas}
          >
            Siguiente
          </button>
        </div>
      )}

      <CrearEventoDialog open={crearOpen} onClose={() => setCrearOpen(false)} />
      {completar && (
        <CompletarEventoDialog
          evento={completar}
          open={!!completar}
          onClose={() => setCompletar(null)}
        />
      )}
      {cancelar && (
        <CancelarEventoDialog
          evento={cancelar}
          open={!!cancelar}
          onClose={() => setCancelar(null)}
        />
      )}
      {editar && (
        <ActualizarEventoDialog
          evento={editar}
          open={!!editar}
          onClose={() => setEditar(null)}
        />
      )}
    </div>
  )
}
