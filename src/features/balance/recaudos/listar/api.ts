import { fetcher } from '@/shared/api/fetcher'
import type { RecaudoReal } from '../../model/types'

export const listarRecaudos = (vigencia?: number): Promise<RecaudoReal[]> => {
  const qs = vigencia ? `?vigencia=${vigencia}` : ''
  return fetcher(`/api/v1/balance/recaudos${qs}`)
}
