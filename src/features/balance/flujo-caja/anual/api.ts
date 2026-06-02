import { fetcher } from '@/shared/api/fetcher'
import type { ResumenAnual } from '../../model/types'

export const getResumenAnual = (vigencia: number): Promise<ResumenAnual> =>
  fetcher(`/api/v1/balance/flujo-caja/resumen-anual?vigencia=${vigencia}`)
