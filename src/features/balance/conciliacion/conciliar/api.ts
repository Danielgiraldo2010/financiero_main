import { fetcher } from '@/shared/api/fetcher'
import type { ConciliarBalanceCommand } from '../../model/types'

export const conciliarBalance = ({ id, ...body }: ConciliarBalanceCommand & { id: number }): Promise<void> =>
  fetcher(`/api/v1/balance/conciliacion/${id}/conciliar`, { method: 'POST', body: JSON.stringify(body) })
