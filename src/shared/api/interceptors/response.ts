// shared/api/interceptors/response.ts
// 401 -> silentRefresh, 403 -> /no-autorizado, 422 -> ApiError
import { ApiError } from '../errors/ApiError'
import type { ProblemDetails } from '../types'
import { silentRefresh } from '../auth/refresh-token'
import { clearAccessToken, clearRefreshToken } from '../auth/token-store'
import { clearTenantId } from '../tenant/tenant-store'

// Rutas que nunca deben disparar silentRefresh aunque devuelvan 401
const AUTH_ENDPOINTS = [
  '/api/v1/auth/login',
  '/api/v1/auth/refresh',
]

function isAuthEndpoint(url: string): boolean {
  return AUTH_ENDPOINTS.some((path) => url.includes(path))
}

export async function applyResponseInterceptor<T>(
  response: Response,
  retryFn?: () => Promise<T>,
): Promise<T> {
  if (response.ok) {
    if (response.status === 204) return undefined as T
    const ct = response.headers.get('Content-Type') ?? ''
    if (ct.includes('application/json')) return response.json() as Promise<T>
    return undefined as T
  }

  // 401 en login/refresh → error directo, sin silentRefresh
  if (response.status === 401 && isAuthEndpoint(response.url)) {
    let problem: ProblemDetails = {}
    try { problem = (await response.json()) as ProblemDetails } catch { /* no-json */ }
    const message = problem.detail ?? problem.title ?? 'Credenciales incorrectas'
    throw new ApiError(message, 401)
  }

  // 401 en cualquier otra ruta → intentar silentRefresh
  if (response.status === 401 && retryFn) {
    try {
      await silentRefresh()
      return retryFn()
    } catch {
      clearAccessToken()
      clearRefreshToken()
      clearTenantId()
      window.location.href = '/login'
      throw new ApiError('Sesión expirada', 401)
    }
  }

  if (response.status === 403) {
    window.location.href = '/no-autorizado'
    throw new ApiError('Sin permiso para esta acción', 403)
  }

  let problem: ProblemDetails = {}
  try { problem = (await response.json()) as ProblemDetails } catch { /* no-json */ }

  const message = problem.detail ?? problem.title ?? `Error ${response.status}`
  throw new ApiError(message, response.status, problem.errors)
}