import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { usePermissions } from '@/shared/hooks/usePermissions'

interface RoleGuardProps {
  roles: string[]
  children: ReactNode
}

export function RoleGuard({ roles, children }: RoleGuardProps) {
  const { hasRole } = usePermissions()
  const navigate = useNavigate()
  const allowed = hasRole(roles)

  useEffect(() => {
    if (!allowed) {
      // ✅ Usar ruta declarada en el router
      // Crea src/app/router/routes/no-autorizado.tsx para tener página dedicada
      navigate({ to: '/dashboard' })
    }
  }, [allowed, navigate])

  if (!allowed) return null
  return <>{children}</>
}