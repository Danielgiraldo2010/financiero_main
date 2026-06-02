import { createFileRoute, Navigate } from "@tanstack/react-router"
import { lazy, Suspense } from "react"
import { useAuthStore } from "@/shared/state/auth.store"

const UsuarioDetailPage = lazy(
  () =>
    import("@/features/identidad/usuarios/detalle/ui/UsuarioDetailPage").then(
      (m) => ({ default: m.UsuarioDetailPage })
    )
)

function UsuarioDetailRoute() {
  const roles = useAuthStore((s) => s.roles)
  const { id } = Route.useParams()
  const allowed = ["SUPERADMIN", "ADMIN_CENTRAL"]

  if (!roles.some((r) => allowed.includes(r))) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <Suspense fallback={<PageSkeleton />}>
      <UsuarioDetailPage id={id} />
    </Suspense>
  )
}

export const Route = createFileRoute("/_authenticated/admin/usuarios/$id")({
  component: UsuarioDetailRoute,
})

function PageSkeleton() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      <div className="h-8 w-64 rounded bg-muted" />
      <div className="grid grid-cols-3 gap-4">
        <div className="h-24 rounded bg-muted" />
        <div className="h-24 rounded bg-muted" />
        <div className="h-24 rounded bg-muted" />
      </div>
      <div className="h-48 rounded bg-muted" />
    </div>
  )
}