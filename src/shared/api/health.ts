/**
 * Verifica conectividad con el backend al arrancar la app.
 * Llama GET /api/v1/health (endpoint público sin autenticación).
 * No usa el fetcher principal para evitar interceptors de auth en el health check.
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch('/api/v1/health', {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5 segundos de timeout
    })
    return res.ok
  } catch {
    console.warn('[SistemaFinanciero] Backend no disponible en /api/v1/health')
    return false
  }
}
