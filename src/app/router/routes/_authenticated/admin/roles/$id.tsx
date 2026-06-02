import { createFileRoute, Navigate } from "@tanstack/react-router"
import { lazy, Suspense } from "react"
import { useAuthStore } from "@/shared/state/auth.store"

const RolDetailPage = lazy(
  () =>
    import("@/features/identidad/roles/detalle/ui/RolDetailPage").then(
      (m) => ({ default: m.RolDetailPage })
    )
)

function RolDetailRoute() {
  const roles = useAuthStore((s) => s.roles)
  const { id } = Route.useParams()

  if (!roles.includes("SUPERADMIN")) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <Suspense fallback={<PageSkeleton />}>
      <RolDetailPage id={id} />
    </Suspense>
  )
}

export const Route = createFileRoute("/_authenticated/admin/roles/$id")({
  component: RolDetailRoute,
})

function PageSkeleton() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      <div className="h-8 w-48 rounded bg-muted" />
      <div className="h-48 rounded bg-muted" />
    </div>
  )
}
