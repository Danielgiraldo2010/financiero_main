import { fetcher } from '@/shared/api/fetcher'
import type { RecaudoReal } from '../../model/types'

export const getRecaudo = (id: number): Promise<RecaudoReal> =>
  fetcher(`/api/v1/balance/recaudos/${id}`)
