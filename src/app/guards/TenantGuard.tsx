// app/guards/TenantGuard.tsx
import type { ReactNode } from 'react'
import { useTenantStore } from '@/shared/state/tenant.store'
import { useAuthStore } from '@/shared/state/auth.store'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface TenantGuardProps {
  children: ReactNode
}

export function TenantGuard({ children }: TenantGuardProps) {
  const { tenantActivo, unidadesDisponibles, cambiarTenant, verTodos, setVerTodos } = useTenantStore()
  const roles = useAuthStore((s) => s.roles)
  const esSuperadmin = roles.includes('SUPERADMIN')

  // SUPERADMIN siempre pasa: puede navegar sin tenant activo
  // porque tiene la opción "Todas las unidades" en el Header
  if (esSuperadmin) return <>{children}</>

  // El resto de roles deben tener un tenant activo para continuar
  if (!tenantActivo && !verTodos) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Selecciona tu Unidad Ejecutora</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              onValueChange={(v) => {
                const ue = unidadesDisponibles.find((u) => String(u.id) === v)
                if (ue) cambiarTenant(ue)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar unidad..." />
              </SelectTrigger>
              <SelectContent>
                {unidadesDisponibles.map((ue) => (
                  <SelectItem key={ue.id} value={String(ue.id)}>
                    {ue.codigo ? `${ue.codigo} — ${ue.nombre}` : ue.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
