import type { EventoSeguimiento, EstadoEvento } from "../../../model/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCompletarEvento } from "../../completar/hook"

const ESTADO_BADGE: Record<EstadoEvento, string> = {
  PENDIENTE:   "bg-yellow-100 text-yellow-800",
  EN_PROCESO:  "bg-blue-100 text-blue-800",
  COMPLETADO:  "bg-green-100 text-green-800",
  VENCIDO:     "bg-red-100 text-red-800",
}

interface Props {
  evento: EventoSeguimiento
  onClose: () => void
}

export function EventoDetailDialog({ evento, onClose }: Props) {
  const { mutate: completar, isPending } = useCompletarEvento()

  return (
    <Dialog open onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Evento de seguimiento</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className={`rounded px-2 py-0.5 text-xs font-semibold ${ESTADO_BADGE[evento.estado]}`}>
              {evento.estado}
            </span>
            <span className="text-xs text-muted-foreground">{evento.tipo}</span>
          </div>
          <p className="text-base font-semibold">{evento.titulo}</p>
          {evento.descripcion && (
            <p className="text-sm text-muted-foreground">{evento.descripcion}</p>
          )}
          <dl className="grid gap-x-4 gap-y-1 text-sm sm:grid-cols-2">
            <dt className="text-muted-foreground">Fecha limite</dt>
            <dd>{evento.fechaLimite}</dd>
            {evento.fechaCompletado && (
              <>
                <dt className="text-muted-foreground">Completado</dt>
                <dd>{evento.fechaCompletado}</dd>
              </>
            )}
            {evento.responsableNombre && (
              <>
                <dt className="text-muted-foreground">Responsable</dt>
                <dd>{evento.responsableNombre}</dd>
              </>
            )}
            {evento.proyectoNombre && (
              <>
                <dt className="text-muted-foreground">Proyecto</dt>
                <dd>{evento.proyectoNombre}</dd>
              </>
            )}
          </dl>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
          >
            Cerrar
          </button>
          {(evento.estado === "PENDIENTE" || evento.estado === "EN_PROCESO") && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => completar(evento.id, { onSuccess: onClose })}
              className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isPending ? "Completando..." : "Marcar completado"}
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
