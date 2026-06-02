// src/app/router/routes/_authenticated/admin/roles/index.tsx
import { createFileRoute } from "@tanstack/react-router"
import { lazy, Suspense } from "react"
import { useAuthStore } from "@/shared/state/auth.store"
import { Navigate } from "@tanstack/react-router"

const RolesPage = lazy(
  () => import("@/features/identidad/roles/listar/ui/RolesPage")
    .then((m) => ({ default: m.RolesPage }))
)

function RolesRoute() {
  const roles = useAuthStore((s) => s.roles)
  if (!roles.includes("SUPERADMIN")) {
    return <Navigate to="/dashboard" replace />
  }
  return (
    <Suspense fallback={<PageSkeleton />}>
      <RolesPage />
    </Suspense>
  )
}

export const Route = createFileRoute("/_authenticated/admin/roles/")({
  component: RolesRoute,
})

function PageSkeleton() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      <div className="h-8 w-32 rounded bg-muted" />
      <div className="h-48 rounded bg-muted" />
    </div>
  )
}