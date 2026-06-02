import { Dialog } from "@/shared/ui/modal/Dialog"
import { StatusBadge } from "@/shared/ui/feedback/StatusBadge"
import type { EventoAuditoria } from "../../model/types"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface EventoAuditoriaDialogProps {
  open: boolean
  evento: EventoAuditoria
  onClose: () => void
}

export function EventoAuditoriaDialog({
  open,
  evento,
  onClose,
}: EventoAuditoriaDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Detalle del evento"
      description={evento.accion}
    >
      <div className="space-y-3 pt-2 text-sm">
        <Row label="ID"            value={String(evento.id)} />
        <Row label="Usuario"       value={evento.usuarioNombre ?? "Sistema"} />
        <Row label="Unidad"        value={evento.unidadEjecutora ?? "—"} />
        <Row label="Accion"        value={evento.accion} mono />
        <Row label="Descripcion"   value={evento.descripcion ?? "—"} />
        <Row label="Entidad"       value={evento.entidadTipo ?? "—"} />
        <Row label="ID Entidad"    value={evento.entidadId ?? "—"} mono />
        <div className="flex items-center justify-between py-1">
          <span className="text-muted-foreground font-medium">Resultado</span>
          <StatusBadge
            variant={evento.resultado === "Exito" ? "success" : "error"}
            label={evento.resultado}
          />
        </div>
        {/* ✅ detalleError sí existe en EventoAuditoria — evento.detalle no existe */}
        {evento.detalleError && (
          <Row label="Error" value={evento.detalleError} mono />
        )}
        <Row label="Duracion" value={evento.duracionMs != null ? evento.duracionMs + " ms" : "—"} />
        <Row label="IP"       value={evento.ipAddress ?? "—"} mono />
        <Row
          label="Fecha"
          value={format(new Date(evento.fechaHora), "dd/MM/yyyy HH:mm:ss", { locale: es })}
        />
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="rounded-md border border-input px-4 py-2 text-sm hover:bg-accent"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Dialog>
  )
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1">
      <span className="text-muted-foreground font-medium shrink-0">{label}</span>
      <span className={mono ? "font-mono text-xs" : ""}>{value}</span>
    </div>
  )
}