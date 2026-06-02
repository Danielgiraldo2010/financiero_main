import { fetcher } from '@/shared/api/fetcher'
import type { IncorporarRecursoCommand } from '../../model/types'

export const validarRecurso = (id: number): Promise<void> =>
  fetcher(`/api/v1/balance/recursos/${id}/validar`, { method: 'POST' })

export const incorporarRecurso = ({ id, ...body }: IncorporarRecursoCommand & { id: number }): Promise<void> =>
  fetcher(`/api/v1/balance/recursos/${id}/incorporar`, { method: 'POST', body: JSON.stringify(body) })
