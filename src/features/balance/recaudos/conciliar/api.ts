import { fetcher } from '@/shared/api/fetcher'

export const conciliarRecaudo = (id: number, observaciones?: string): Promise<void> =>
  fetcher(`/api/v1/balance/recaudos/${id}/conciliar`, {
    method: 'POST',
    body: JSON.stringify({ id, observaciones }),
  })
