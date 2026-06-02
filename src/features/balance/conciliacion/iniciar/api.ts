import { fetcher } from '@/shared/api/fetcher'
import type { RegistrarConciliacionCommand, ConciliacionBalance } from '../../model/types'

export const registrarConciliacion = (body: RegistrarConciliacionCommand): Promise<ConciliacionBalance> =>
  fetcher('/api/v1/balance/conciliacion', { method: 'POST', body: JSON.stringify(body) })
