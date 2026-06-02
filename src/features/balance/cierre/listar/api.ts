import { fetcher } from '@/shared/api/fetcher'
import type { CierreVigencia } from '../../model/types'

export const listarCierres = (): Promise<CierreVigencia[]> =>
  fetcher('/api/v1/balance/cierre')
