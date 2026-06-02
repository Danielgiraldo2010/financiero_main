import { useRevocarSesion } from "../../revocar/hook"
import { useSesiones } from "../hook"
import { ConfirmDialog } from "@/shared/ui/overlays/ConfirmDialog"
import { StatusBadge } from "@/shared/ui/feedback/StatusBadge"
import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// Importado en PerfilPage de FE1-A
export function SesionesActivasPanel() {
  const { data: sesiones, isLoading } = useSesiones()
  const { mutate: revocar, isPending } = useRevocarSesion()
  const [toRevocar, setToRevocar] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <p className="text-sm text-muted-foreground">Cargando sesiones...</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-sm">Sesiones activas</h3>
      </div>

      {!sesiones || sesiones.length === 0 ? (
        <p className="p-4 text-sm text-muted-foreground">
          No hay sesiones activas.
        </p>
      ) : (
        <ul className="divide-y">
          {sesiones.map((s) => (
            <li key={s.id} className="flex items-center justify-between p-4">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{s.usuarioNombre}</p>
                <p className="text-xs text-muted-foreground">
                  IP: {s.ipAddress ?? "Desconocida"} — Inicio:{" "}
                  {format(new Date(s.fechaInicio), "dd/MM/yyyy HH:mm", {
                    locale: es,
                  })}
                </p>
                <p className="text-xs text-muted-foreground">
                  Expira:{" "}
                  {format(new Date(s.fechaExpiracion), "dd/MM/yyyy HH:mm", {
                    locale: es,
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge
                  variant={s.esActiva ? "success" : "warning"}
                  label={s.esActiva ? "Activa" : "Expirada"}
                />
                {s.esActiva && (
                  <button
                    onClick={() => setToRevocar(s.id)}
                    className="text-xs text-destructive hover:underline"
                  >
                    Revocar
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={toRevocar !== null}
        title="Revocar sesion"
        description="Se cerrara esta sesion de forma inmediata."
        confirmLabel="Revocar"
        variant="destructive"
        isLoading={isPending}
        onConfirm={() => {
          if (!toRevocar) return
          revocar(toRevocar, { onSuccess: () => setToRevocar(null) })
        }}
        onCancel={() => setToRevocar(null)}
      />
    </div>
  )
}
