// features/integracion/exportaciones/snies/ui/ExportarSniesDialog.tsx

import { useState } from "react"
import { useExportarSNIES } from "../hook"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/ui/primitives/dialog"
import { Button } from "@/shared/ui/primitives/button"
import { Label } from "@/shared/ui/primitives/label"
import { Input } from "@/shared/ui/primitives/input"
import { LoadingSpinner } from "@/shared/ui/feedback/LoadingSpinner"

interface Props {
  open: boolean
  onClose: () => void
}

export function ExportarSniesDialog({ open, onClose }: Props) {
  const [vigencia, setVigencia] = useState<string>(String(new Date().getFullYear()))
  const { exportar, isPending, isPolling, estado, reset } = useExportarSNIES()

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleExportar = () => {
    const v = parseInt(vigencia, 10)
    if (isNaN(v)) return
    exportar(v)
  }

  const finalizado = estado?.estado === "COMPLETADO" || estado?.estado === "ERROR"

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Exportar al SNIES</DialogTitle>
        </DialogHeader>

        {!estado && (
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="snies-vigencia">Vigencia</Label>
              <Input
                id="snies-vigencia"
                type="number"
                value={vigencia}
                onChange={(e) => setVigencia(e.target.value)}
                placeholder="Ej. 2024"
                disabled={isPending}
              />
            </div>
          </div>
        )}

        {(isPending || isPolling) && !finalizado && (
          <div className="flex flex-col items-center gap-3 py-4">
            <LoadingSpinner />
            <p className="text-sm text-muted-foreground">
              {isPending ? "Iniciando exportación..." : "Procesando exportación SNIES..."}
            </p>
          </div>
        )}

        {finalizado && estado && (
          <div
            className={`rounded-md p-3 text-sm ${
              estado.estado === "COMPLETADO"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            <p className="font-semibold">
              {estado.estado === "COMPLETADO" ? "Exportación completada" : "Error en exportación"}
            </p>
            <p>{estado.detalleError ?? `${estado.registrosProcesados ?? 0} registros procesados`}</p>
            {estado.urlArchivo && (
              <a
                href={estado.urlArchivo}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block underline"
              >
                Descargar archivo
              </a>
            )}
          </div>
        )}

        <DialogFooter>
          {!estado ? (
            <>
              <Button variant="outline" onClick={handleClose} disabled={isPending}>
                Cancelar
              </Button>
              <Button onClick={handleExportar} disabled={isPending || !vigencia}>
                Exportar
              </Button>
            </>
          ) : (
            <Button onClick={handleClose}>Cerrar</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
