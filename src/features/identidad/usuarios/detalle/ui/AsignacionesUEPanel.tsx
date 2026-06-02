import { lazy, Suspense, useState } from "react"
import type { AsignacionUE, Usuario } from "../../model/types"
import { useRevocarUE } from "../../acciones/hook"
import { StatusBadge } from "@/shared/ui/feedback/StatusBadge"
import { ConfirmDialog } from "@/shared/ui/overlays/ConfirmDialog"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const AsignarUEDialog = lazy(() => import("./AsignarUEDialog"))

interface AsignacionesUEPanelProps {
  usuario: Usuario
}

export function AsignacionesUEPanel({ usuario }: AsignacionesUEPanelProps) {
  const [showAsignar, setShowAsignar] = useState(false)
  const [toRevocar, setToRevocar] = useState<AsignacionUE | null>(null)
  const { mutate: revocarUE, isPending } = useRevocarUE(usuario.id)

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-sm">Unidades ejecutoras asignadas</h3>
        <button
          onClick={() => setShowAsignar(true)}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
        >
          + Asignar unidad
        </button>
      </div>

      {usuario.unidades.length === 0 ? (
        <p className="p-4 text-sm text-muted-foreground">
          Sin unidades ejecutoras asignadas.
        </p>
      ) : (
        <ul className="divide-y">
          {usuario.unidades.map((ue) => (
            <li
              key={ue.unidadEjecutoraId}
              className="flex items-center justify-between p-4"
            >
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{ue.unidadEjecuroraNombre}</p>
                <p className="text-xs text-muted-foreground">
                  Rol: {ue.rol}
                  {ue.subDependencia ? ` - ${ue.subDependencia}` : ""}
                </p>
                {ue.fechaVencimiento && (
                  <p className="text-xs text-muted-foreground">
                    Vence:{" "}
                    {format(new Date(ue.fechaVencimiento), "dd/MM/yyyy", {
                      locale: es,
                    })}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge
                  variant={ue.esActivo ? "success" : "error"}
                  label={ue.esActivo ? "Activa" : "Inactiva"}
                />
                <button
                  onClick={() => setToRevocar(ue)}
                  className="text-xs text-destructive hover:underline"
                >
                  Revocar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showAsignar && (
        <Suspense fallback={null}>
          <AsignarUEDialog
            open={showAsignar}
            usuarioId={usuario.id}
            onClose={() => setShowAsignar(false)}
          />
        </Suspense>
      )}

      <ConfirmDialog
        open={toRevocar !== null}
        title="Revocar unidad ejecutora"
        description={
          toRevocar
            ? "Se revocara el acceso a " +
              toRevocar.unidadEjecuroraNombre +
              ". Esta accion no puede deshacerse."
            : ""
        }
        confirmLabel="Revocar"
        variant="destructive"
        isLoading={isPending}
        onConfirm={() => {
          if (!toRevocar) return
          revocarUE(toRevocar.unidadEjecutoraId, {
            onSuccess: () => setToRevocar(null),
          })
        }}
        onCancel={() => setToRevocar(null)}
      />
    </div>
  )
}
