import { lazy, Suspense, useState } from "react"
import { useRol } from "../hook"
import { useRevocarClaim } from "../../claims/hook"
import { PageHeader } from "@/shared/ui/layout/PageHeader"
import { ConfirmDialog } from "@/shared/ui/overlays/ConfirmDialog"
import { Trash2 } from "lucide-react"

const AsignarClaimDialog = lazy(() => import("./AsignarClaimDialog"))

interface RolDetailPageProps {
  id: string // roleName — ej: "SUPERADMIN"
}

export function RolDetailPage({ id }: RolDetailPageProps) {
  const { data: rol, isLoading, isError } = useRol(id)
  const { mutate: revocarClaim, isPending: revocando } = useRevocarClaim(id)

  const [showAsignar, setShowAsignar] = useState(false)
  const [toRevocar, setToRevocar] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-sm text-muted-foreground">Cargando...</span>
      </div>
    )
  }

  if (isError || !rol) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-sm text-destructive">
          Error al cargar el rol.
        </span>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title={rol.name}
        description={"Nombre normalizado: " + rol.normalizedName}
        actions={
          <button
            onClick={() => setShowAsignar(true)}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            + Asignar permiso
          </button>
        }
      />

      {/* Lista de permisos */}
      <div className="rounded-lg border bg-card">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm">
            Permisos asignados ({rol.claims.length})
          </h3>
        </div>

        {rol.claims.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">
            Este rol no tiene permisos asignados.
          </p>
        ) : (
          <ul className="divide-y">
            {rol.claims.map((permission: string) => (
              <li
                key={permission}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <span className="text-xs font-mono bg-muted rounded px-2 py-1">
                  {permission}
                </span>
                <button
                  onClick={() => setToRevocar(permission)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  aria-label={"Revocar permiso " + permission}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Dialog asignar claim */}
      {showAsignar && (
        <Suspense fallback={null}>
          <AsignarClaimDialog
            open={showAsignar}
            roleName={rol.name}
            onClose={() => setShowAsignar(false)}
          />
        </Suspense>
      )}

      {/* Confirm revocar claim */}
      <ConfirmDialog
        open={toRevocar !== null}
        title="Revocar permiso"
        description={
          toRevocar
            ? "Se revocara el permiso \"" +
              toRevocar +
              "\" del rol " +
              rol.name +
              "."
            : ""
        }
        confirmLabel="Revocar"
        variant="destructive"
        isLoading={revocando}
        onConfirm={() => {
          if (!toRevocar) return
          revocarClaim(toRevocar, {
            onSuccess: () => setToRevocar(null),
          })
        }}
        onCancel={() => setToRevocar(null)}
      />
    </div>
  )
}
