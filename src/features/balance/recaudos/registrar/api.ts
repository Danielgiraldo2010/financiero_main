import { fetcher } from '@/shared/api/fetcher'
import type { RegistrarRecaudoCommand, RecaudoReal } from '../../model/types'

export const registrarRecaudo = (body: RegistrarRecaudoCommand): Promise<RecaudoReal> =>
  fetcher('/api/v1/balance/recaudos', { method: 'POST', body: JSON.stringify(body) })
