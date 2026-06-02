// shared/api/interceptors/request.ts
// G2: inyecta Authorization y X-Tenant-Id en TODAS las peticiones
import { getAccessToken } from '../auth/token-store'
import { getTenantId } from '../tenant/tenant-store'

export function applyRequestInterceptor(
  _url: string,
  init: RequestInit = {},
): RequestInit {
  const headers = new Headers(init.headers)

  // ⚠️ No agregar Content-Type si el body es FormData —
  // el browser necesita calcularlo con el boundary correcto
  const isFormData = init.body instanceof FormData
  if (!isFormData && !headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json')
  }

  const skipAuth = headers.get('X-Skip-Auth') === '1'
  headers.delete('X-Skip-Auth')

  if (!skipAuth) {
    const token = getAccessToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
    const tenantId = getTenantId()
    if (tenantId) headers.set('X-Tenant-Id', tenantId)
  }

  return { ...init, headers }
}