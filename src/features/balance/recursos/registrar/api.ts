import { fetcher } from '@/shared/api/fetcher'
import type { RegistrarRecursoCommand, RecursoBalance } from '../../model/types'

export const registrarRecurso = (body: RegistrarRecursoCommand): Promise<RecursoBalance> =>
  fetcher('/api/v1/balance/recursos', { method: 'POST', body: JSON.stringify(body) })
