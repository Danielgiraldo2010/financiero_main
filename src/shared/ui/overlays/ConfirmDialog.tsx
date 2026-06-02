// src/shared/ui/overlays/ConfirmDialog.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { LoadingSpinner } from "@/shared/ui/feedback/LoadingSpinner"

// ✅ Ampliar variant para cubrir todos los consumidores:
// DocumentosPage usa "warning", "info", "error" además de "default" y "destructive"
export type ConfirmDialogVariant = "default" | "destructive" | "warning" | "info" | "error"

interface ConfirmDialogProps {
  open: boolean
  title?: string | undefined
  description?: string | undefined
  confirmLabel?: string | undefined
  cancelLabel?: string | undefined
  variant?: ConfirmDialogVariant | undefined
  onConfirm: () => void
  isLoading?: boolean | undefined
  onOpenChange?: ((open: boolean) => void) | undefined
  onCancel?: (() => void) | undefined
  // ✅ children: DocumentosPage pasa el mensaje como children en lugar de description
  children?: React.ReactNode | undefined
}

// Estilos del botón de confirmación por variante
const actionClass: Record<ConfirmDialogVariant, string> = {
  default:     "",
  destructive: "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
  error:       "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
  warning:     "bg-amber-500 hover:bg-amber-500/90 text-white dark:text-white",
  info:        "bg-blue-600 hover:bg-blue-600/90 text-white dark:text-white",
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "default",
  onConfirm,
  isLoading = false,
  onOpenChange,
  onCancel,
  children,
}: ConfirmDialogProps) {
  const handleOpenChange = (value: boolean) => {
    if (!value) {
      onCancel?.()
      onOpenChange?.(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {title && <AlertDialogTitle>{title}</AlertDialogTitle>}
          {/* ✅ children tiene precedencia sobre description prop */}
          {children
            ? <AlertDialogDescription>{children}</AlertDialogDescription>
            : description && <AlertDialogDescription>{description}</AlertDialogDescription>
          }
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={actionClass[variant]}
          >
            {isLoading ? <LoadingSpinner size="sm" /> : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
