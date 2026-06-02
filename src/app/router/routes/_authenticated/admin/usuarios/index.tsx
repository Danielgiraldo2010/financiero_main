// src/app/router/routes/_authenticated/admin/usuarios/index.tsx
import { createFileRoute } from "@tanstack/react-router"
import { lazy, Suspense } from "react"
import { useAuthStore } from "@/shared/state/auth.store"
import { Navigate } from "@tanstack/react-router"

const UsuariosPage = lazy(
  () => import("@/features/identidad/usuarios/listar/ui/UsuariosPage")
    .then((m) => ({ default: m.UsuariosPage }))
)

function UsuariosRoute() {
  const roles = useAuthStore((s) => s.roles)
  const allowed = ["SUPERADMIN", "ADMIN_CENTRAL"]
  if (!roles.some((r) => allowed.includes(r))) {
    return <Navigate to="/dashboard" replace />
  }
  return (
    <Suspense fallback={<PageSkeleton />}>
      <UsuariosPage />
    </Suspense>
  )
}

export const Route = createFileRoute("/_authenticated/admin/usuarios/")({
  component: UsuariosRoute,
})

function PageSkeleton() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      <div className="h-8 w-48 rounded bg-muted" />
      <div className="h-64 rounded bg-muted" />
    </div>
  )
}