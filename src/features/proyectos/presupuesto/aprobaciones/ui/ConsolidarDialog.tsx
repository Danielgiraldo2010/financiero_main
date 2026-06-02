// aprobaciones/ui/ConsolidarDialog.tsx
// Diálogo de confirmación de consolidación.
// IRREVERSIBLE — el usuario debe escribir "CONSOLIDAR" para confirmar (03b-I6).

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle } from "lucide-react"

interface ConsolidarDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isPending: boolean
}

const PALABRA_CONFIRMACION = "CONSOLIDAR"

export function ConsolidarDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: ConsolidarDialogProps) {
  const [input, setInput] = useState("")
  const habilitado = input === PALABRA_CONFIRMACION

  const handleConfirm = () => {
    if (!habilitado) return
    onConfirm()
    setInput("")
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setInput("")
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Confirmar consolidación
          </DialogTitle>
          <DialogDescription>
            <span className="mt-2 block space-y-3 text-sm text-muted-foreground">
              <span className="block">
                Esta acción{" "}
                <strong className="text-foreground">creará o actualizará</strong>{" "}
                las líneas del presupuesto de la Unidad Ejecutora con los valores
                definitivos de este proyecto.
              </span>
              <span className="block font-medium text-destructive">
                Una vez consolidado no se pueden agregar más líneas al
                presupuesto del proyecto.
              </span>
              <span className="block">Esta operación es irreversible.</span>
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="confirmacion-input">
            Escriba{" "}
            <code className="rounded bg-muted px-1 font-mono text-xs">
              {PALABRA_CONFIRMACION}
            </code>{" "}
            para confirmar
          </Label>
          <Input
            id="confirmacion-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={PALABRA_CONFIRMACION}
            autoComplete="off"
            disabled={isPending}
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!habilitado || isPending}
          >
            {isPending ? "Consolidando..." : "Consolidar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
