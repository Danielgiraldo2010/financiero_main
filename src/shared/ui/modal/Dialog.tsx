// Wrapper de conveniencia — re-exporta el Dialog de base-ui
// Los features importan desde aqui en lugar de @/components/ui/dialog
import {
  Dialog as DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import type { ReactNode } from "react"

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  /** Ancho maximo del dialogo. Default: md */
  maxWidth?: "sm" | "md" | "lg"
  /**
   * Si es false, el click fuera del dialogo y la tecla Escape
   * no cierran el formulario. Util cuando hay datos digitados
   * que no deben perderse accidentalmente.
   * Default: true (comportamiento original).
   */
  closeOnOverlayClick?: boolean
}

const maxWidthMap = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  maxWidth = "md",
  closeOnOverlayClick = true,
}: DialogProps) {
  return (
    <DialogRoot
      open={open}
      onOpenChange={(o, eventDetails) => {
        if (!o) {
          // Cuando closeOnOverlayClick=false bloqueamos outside-press y escape-key.
          // El botón X interno (close-press) siempre cierra normalmente.
          if (
            !closeOnOverlayClick &&
            (eventDetails.reason === "outside-press" ||
              eventDetails.reason === "escape-key")
          ) {
            return
          }
          onClose()
        }
      }}
      // disablePointerDismissal bloquea el cierre por click en el backdrop a nivel Root
      disablePointerDismissal={!closeOnOverlayClick}
    >
      <DialogContent className={maxWidthMap[maxWidth]}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </DialogRoot>
  )
}

// Re-exportar primitivas para uso avanzado
export {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
}
