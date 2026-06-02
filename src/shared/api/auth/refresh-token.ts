// shared/api/auth/refresh-token.ts
// silentRefresh: usado SOLO por interceptors/response.ts (flujo 401)
// Desacoplado de features para evitar dependencia circular
// Backend: POST /api/v1/auth/refresh { refreshToken }
import { getRefreshToken, setAccessToken, setRefreshToken } from './token-store'

let _isRefreshing = false
let _refreshPromise: Promise<string> | null = null

export async function silentRefresh(): Promise<string> {
  if (_isRefreshing && _refreshPromise) return _refreshPromise

  const rt = getRefreshToken()
  if (!rt) throw new Error('No hay refresh token disponible')

  _isRefreshing = true
  _refreshPromise = fetch('/api/v1/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: rt }),
  })
    .then(async (res) => {
      if (!res.ok) throw new Error('Refresh token invalido o expirado')
      const data = await res.json() as { accessToken: string; refreshToken: string }
      setAccessToken(data.accessToken)
      setRefreshToken(data.refreshToken)
      return data.accessToken
    })
    .finally(() => { _isRefreshing = false; _refreshPromise = null })

  return _refreshPromise
}
