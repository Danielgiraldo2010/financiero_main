import { useEffect, type ReactNode } from 'react'
import { useAuthStore } from '@/shared/state/auth.store'
import { silentRefresh } from '@/shared/api/auth/refresh-token'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, logout } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) return

    silentRefresh()
      .catch(() => {
        logout()
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>
}