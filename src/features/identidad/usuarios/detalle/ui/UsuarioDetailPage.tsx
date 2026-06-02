import { lazy, Suspense, useState } from "react"
import { useUsuario } from "../hook"
import { useDesactivarUsuario, useBloquearUsuario, useReset2FA } from "../../acciones/hook"
import { AsignacionesUEPanel } from "./AsignacionesUEPanel"
import { ConfirmDialog } from "@/shared/ui/overlays/ConfirmDialog"
import { StatusBadge } from "@/shared/ui/feedback/StatusBadge"
import { PageHeader } from "@/shared/ui/layout/PageHeader"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const ModificarUsuarioDialog = lazy(
  () => import("../../modificar/ui/ModificarUsuarioDialog")
)

interface UsuarioDetailPageProps {
  id: string
}

export function UsuarioDetailPage({ id }: UsuarioDetailPageProps) {
  const { data: usuario, isLoading, isError } = useUsuario(id)
  const [showModificar, setShowModificar] = useState(false)
  const [confirmAccion, setConfirmAccion] = useState<
    "desactivar" | "bloquear" | "reset2fa" | null
  >(null)

  const { mutate: desactivar, isPending: desactivando } = useDesactivarUsuario()
  const { mutate: bloquear, isPending: bloqueando } = useBloquearUsuario()
  const { mutate: reset2fa, isPending: reseteando2fa } = useReset2FA()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-sm text-muted-foreground">Cargando...</span>
      </div>
    )
  }

  if (isError || !usuario) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-sm text-destructive">
          Error al cargar el usuario.
        </span>
      </div>
    )
  }

  const isPendingAny = desactivando || bloqueando || reseteando2fa

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title={usuario.nombreCompleto ?? usuario.userName}
        description={usuario.email}
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => setShowModificar(true)}
              className="rounded-md border border-input px-3 py-1.5 text-sm hover:bg-accent"
            >
              Editar
            </button>
            <button
              onClick={() => setConfirmAccion("bloquear")}
              className="rounded-md border border-input px-3 py-1.5 text-sm hover:bg-accent"
            >
              Bloquear
            </button>
            <button
              onClick={() => setConfirmAccion("reset2fa")}
              className="rounded-md border border-input px-3 py-1.5 text-sm hover:bg-accent"
            >
              Reset 2FA
            </button>
            {usuario.activo && (
              <button
                onClick={() => setConfirmAccion("desactivar")}
                className="rounded-md bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
              >
                Desactivar
              </button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InfoCard label="Estado">
          <StatusBadge
            variant={usuario.activo ? "success" : "error"}
            label={usuario.activo ? "Activo" : "Inactivo"}
          />
        </InfoCard>
        <InfoCard label="2FA">
          <StatusBadge
            variant={usuario.totp2FaEnabled ? "success" : "warning"}
            label={usuario.totp2FaEnabled ? "Habilitado" : "Deshabilitado"}
          />
        </InfoCard>
        <InfoCard label="Creado en">
          <span className="text-sm">
            {format(new Date(usuario.createdAt), "dd/MM/yyyy HH:mm", {
              locale: es,
            })}
          </span>
        </InfoCard>
        <InfoCard label="Ultimo acceso">
          <span className="text-sm">
            {usuario.lastLoginAt
              ? format(new Date(usuario.lastLoginAt), "dd/MM/yyyy HH:mm", {
                  locale: es,
                })
              : "Nunca"}
          </span>
        </InfoCard>
      </div>

      <AsignacionesUEPanel usuario={usuario} />

      {showModificar && (
        <Suspense fallback={null}>
          <ModificarUsuarioDialog
            open={showModificar}
            usuario={usuario}
            onClose={() => setShowModificar(false)}
          />
        </Suspense>
      )}

      <ConfirmDialog
        open={confirmAccion === "desactivar"}
        title="Desactivar usuario"
        description="Se desactivara el acceso de este usuario al sistema. Esta accion es irreversible desde la UI."
        confirmLabel="Desactivar"
        variant="destructive"
        isLoading={isPendingAny}
        onConfirm={() =>
          desactivar(id, { onSuccess: () => setConfirmAccion(null) })
        }
        onCancel={() => setConfirmAccion(null)}
      />

      <ConfirmDialog
        open={confirmAccion === "bloquear"}
        title="Bloquear usuario"
        description="Se bloqueara temporalmente el acceso de este usuario."
        confirmLabel="Bloquear"
        variant="destructive"
        isLoading={isPendingAny}
        onConfirm={() =>
          bloquear(id, { onSuccess: () => setConfirmAccion(null) })
        }
        onCancel={() => setConfirmAccion(null)}
      />

      <ConfirmDialog
        open={confirmAccion === "reset2fa"}
        title="Resetear 2FA"
        description="Se eliminara la configuracion de 2FA del usuario. Debera configurarlo nuevamente."
        confirmLabel="Resetear"
        variant="default"
        isLoading={isPendingAny}
        onConfirm={() =>
          reset2fa(id, { onSuccess: () => setConfirmAccion(null) })
        }
        onCancel={() => setConfirmAccion(null)}
      />
    </div>
  )
}

function InfoCard({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      {children}
    </div>
  )
}
