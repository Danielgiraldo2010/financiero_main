import { fetcher } from '@/shared/api/fetcher'
import type { ConciliacionBalance } from '../../model/types'

export const listarConciliaciones = (): Promise<ConciliacionBalance[]> =>
  fetcher('/api/v1/balance/conciliacion')
