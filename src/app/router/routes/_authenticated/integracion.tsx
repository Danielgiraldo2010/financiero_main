// app/router/routes/_authenticated/integracion.tsx

import { createFileRoute, Outlet } from "@tanstack/react-router"
import { RoleGuard } from "@/app/guards/RoleGuard"
import { ROLES } from "@/shared/lib/constants"

export const Route = createFileRoute("/_authenticated/integracion")({
  component: () => (
    <RoleGuard roles={[ROLES.ADMIN_CENTRAL, ROLES.FINANCIERO_CENTRAL, ROLES.SUPERADMIN]}>
      <Outlet />
    </RoleGuard>
  ),
})