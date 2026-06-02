import { fetcher } from '@/shared/api/fetcher'
import type { PuntoSalarial } from '../model/types'

export interface ListarPuntosParams {
  vigencia?:     number
  decretoNorma?: string
  estado?:       string
}

export async function listarPuntosSalariales(
  params?: ListarPuntosParams,
): Promise<PuntoSalarial[]> {                          // ← array directo, no PagedResult
  const qs = new URLSearchParams()
  if (params?.vigencia)     qs.set('vigencia',     String(params.vigencia))
  if (params?.decretoNorma) qs.set('decretoNorma', params.decretoNorma)
  if (params?.estado)       qs.set('estado',        params.estado)
  const query = qs.toString() ? `?${qs}` : ''
  return fetcher(`/api/v1/nomina/puntos-salariales${query}`)
}