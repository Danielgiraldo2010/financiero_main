import type { AlertaDashboard, NivelAlerta } from "../../../model/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useDesactivarAlerta } from "../../desactivar/hook"

const NIVEL_BADGE: Record<NivelAlerta, string> = {
  CRITICA: "bg-red-100 text-red-700 border-red-200",
  ALTA:    "bg-orange-100 text-orange-700 border-orange-200",
  MEDIA:   "bg-yellow-100 text-yellow-700 border-yellow-200",
  BAJA:    "bg-blue-100 text-blue-700 border-blue-200",
  INFO:    "bg-gray-100 text-gray-600 border-gray-200",
}

interface Props {
  alerta: AlertaDashboard
  onClose: () => void
}

export function AlertaDetailDialog({ alerta, onClose }: Props) {
  const { mutate: desactivar, isPending } = useDesactivarAlerta()

  function handleDesactivar() {
    desactivar(alerta.id, { onSuccess: onClose })
  }

  return (
    <Dialog open onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalle de alerta</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className={`rounded border px-2 py-0.5 text-xs font-semibold ${NIVEL_BADGE[alerta.nivelAlerta]}`}>
              {alerta.nivelAlerta}
            </span>
            <span className="text-xs text-muted-foreground">{alerta.tipo}</span>
          </div>
          <div>
            <p className="text-base font-semibold">{alerta.titulo}</p>
            <p className="mt-1 text-sm text-muted-foreground">{alerta.mensaje}</p>
          </div>
          {alerta.proyectoNombre && (
            <div className="rounded-md bg-muted px-3 py-2 text-sm">
              <span className="font-medium">Proyecto:</span> {alerta.proyectoNombre}
            </div>
          )}
          <div className="text-xs text-muted-foreground">
            Generada: {alerta.fechaGeneracion}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
          >
            Cerrar
          </button>
          {alerta.activa && (
            <button
              type="button"
              disabled={isPending}
              onClick={handleDesactivar}
              className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isPending ? "Desactivando..." : "Desactivar alerta"}
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
