import { useGenerarAlertas } from "../hook"
import { usePermissions } from "@/shared/hooks/usePermissions"
import { ROLES } from "@/shared/lib/constants"

export function GenerarAlertasButton() {
  const { mutate, isPending, data } = useGenerarAlertas()
  const { hasRole } = usePermissions()

  if (!hasRole([ROLES.FINANCIERO, ROLES.FINANCIERO_CENTRAL, ROLES.ADMIN_CENTRAL, ROLES.SUPERADMIN])) {
    return null
  }

  return (
    <div className="flex items-center gap-3">
      {data && (
        <span className="text-sm text-green-700">
          {data.alertasGeneradas} alertas generadas
        </span>
      )}
      <button
        type="button"
        disabled={isPending}
        onClick={() => mutate(undefined)}
        className="rounded-md border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted disabled:opacity-50"
      >
        {isPending ? "Generando..." : "Generar alertas presupuestales"}
      </button>
    </div>
  )
}
