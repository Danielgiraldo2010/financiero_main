import { fetcher } from '@/shared/api/fetcher'
import type { DiferenciaConciliacion } from '../../model/types'

export const getDiferenciasConciliacion = (): Promise<DiferenciaConciliacion[]> =>
  fetcher('/api/v1/balance/conciliacion/diferencias')
