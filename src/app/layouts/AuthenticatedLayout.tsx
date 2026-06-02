import { Outlet } from '@tanstack/react-router'
import { AppShell } from '@/shared/ui/layout/AppShell'
import { AuthGuard } from '@/app/guards/AuthGuard'
import { TenantGuard } from '@/app/guards/TenantGuard'

export function AuthenticatedLayout() {
  return (
    <AuthGuard>
      <TenantGuard>
        <AppShell>
          <Outlet />
        </AppShell>
      </TenantGuard>
    </AuthGuard>
  )
}
