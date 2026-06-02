import { fetcher } from '@/shared/api/fetcher'
import type { RecursoBalance } from '../../model/types'

export const getRecursoBalance = (id: number): Promise<RecursoBalance> =>
  fetcher(`/api/v1/balance/recursos/${id}`)
