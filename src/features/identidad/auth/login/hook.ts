// features/identidad/auth/login/hook.ts
// Orden invariante 01a-I1 al login exitoso:
//   1. setAccessToken + setRefreshToken
//   2. setTenantId
//   3. auth.store.login + auth.store.setRoles
//   4. GET /auth/me -> tenant.store.setUnidades + cambiarTenant
//   5. navigate /dashboard
// Invariante 01a-I2: si codigoTotp requerido -> Verify2FAForm
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { setAccessToken, setRefreshToken } from '@/shared/api/auth/token-store'
import { setTenantId } from '@/shared/api/tenant/tenant-store'
import { useAuthStore } from '@/shared/state/auth.store'
import { useTenantStore } from '@/shared/state/tenant.store'
import type { ApiError } from '@/shared/api/errors/ApiError'
import { loginUsuario } from './api'
import { getMiPerfil } from '../perfil/api'
import type { LoginCredentials } from '../../model/types'

export function useLogin() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const authLogin = useAuthStore((s) => s.login)
  const authSetRoles = useAuthStore((s) => s.setRoles)
  const setUnidades = useTenantStore((s) => s.setUnidades)
  const cambiarTenant = useTenantStore((s) => s.cambiarTenant)

  return useMutation<void, ApiError, LoginCredentials>({
    mutationFn: async (credentials) => {
      const data = await loginUsuario(credentials)

      // 1. Tokens en memoria
      setAccessToken(data.accessToken)
      setRefreshToken(data.refreshToken)

      // 2. Tenant inicial
      if (data.unidadEjecutoraId !== null) {
        setTenantId(String(data.unidadEjecutoraId))
      }

      // 3. Auth store
      authLogin(
        { id: data.userId, userName: data.userName,
          email: data.email, nombreCompleto: null },
        data.accessToken,
      )
      authSetRoles(data.roles)

      // 4. GET /auth/me -> unidades completas
      const perfil = await getMiPerfil()
      const ues = perfil.unidades.map((u) => ({
        id: u.unidadEjecutoraId,
        nombre: u.unidadEjecutoraNombre,
        rol: u.rol,
        esActivo: u.esActivo,
      }))
      setUnidades(ues)

      const ueActiva =
        ues.find((u) => u.id === data.unidadEjecutoraId) ?? ues[0]
      if (ueActiva) cambiarTenant(ueActiva)

      // Actualizar nombreCompleto en store
      authLogin(
        { id: data.userId, userName: data.userName,
          email: data.email, nombreCompleto: perfil.nombreCompleto },
        data.accessToken,
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] })
      void navigate({ to: '/dashboard' })
    },
  })
}
