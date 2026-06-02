// features/catalogos/vigencias/listar/api.ts
import { fetcher } from '@/shared/api/fetcher'
import type { VigenciaResponse } from '../model/types'

export function listarVigencias(estado?: string): Promise<VigenciaResponse[]> {
  const qs = estado ? `?estado=${estado}` : ''
  return fetcher(`/api/v1/catalogos/vigencias${qs}`)
}
