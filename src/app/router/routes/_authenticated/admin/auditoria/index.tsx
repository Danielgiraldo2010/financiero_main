// src/app/router/routes/_authenticated/admin/auditoria/index.tsx
import { createFileRoute } from "@tanstack/react-router"
import { lazy, Suspense } from "react"
import { useAuthStore } from "@/shared/state/auth.store"
import { Navigate } from "@tanstack/react-router"
import { z } from "zod"

const AuditoriaPage = lazy(
  () => import("@/features/identidad/auditoria/listar/ui/AuditoriaPage")
    .then((m) => ({ default: m.AuditoriaPage }))
)

const searchSchema = z.object({
  page:      z.coerce.number().default(1),
  pageSize:  z.coerce.number().default(30),
  resultado: z.string().optional(),
  desde:     z.string().optional(),
  hasta:     z.string().optional(),
})

function AuditoriaRoute() {
  const roles = useAuthStore((s) => s.roles)
  const allowed = ["SUPERADMIN", "ADMIN_CENTRAL"]
  if (!roles.some((r) => allowed.includes(r))) {
    return <Navigate to="/dashboard" replace />
  }
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AuditoriaPage />
    </Suspense>
  )
}

export const Route = createFileRoute("/_authenticated/admin/auditoria/")({
  validateSearch: (search) => searchSchema.parse(search),
  component: AuditoriaRoute,
})

function PageSkeleton() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      <div className="h-8 w-40 rounded bg-muted" />
      <div className="h-10 rounded bg-muted" />
      <div className="h-96 rounded bg-muted" />
    </div>
  )
}