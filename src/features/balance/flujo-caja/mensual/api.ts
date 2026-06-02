import { fetcher } from '@/shared/api/fetcher'
import type { FlujoCajaMensual } from '../../model/types'

export const getFlujoCajaMensual = (vigencia: number, mes: number): Promise<FlujoCajaMensual> =>
  fetcher(`/api/v1/balance/flujo-caja/mensual?vigencia=${vigencia}&mes=${mes}`)
