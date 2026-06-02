import { fetcher } from '@/shared/api/fetcher'
import type { RecursoBalance } from '../../model/types'

export const listarRecursos = (vigencia?: number): Promise<RecursoBalance[]> => {
  const qs = vigencia ? `?vigencia=${vigencia}` : ''
  return fetcher(`/api/v1/balance/recursos${qs}`)
}
