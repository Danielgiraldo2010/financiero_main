import { fetcher } from '@/shared/api/fetcher'
import type { IniciarCierreCommand, CierreVigencia } from '../../model/types'

export const iniciarCierre = (body: IniciarCierreCommand): Promise<CierreVigencia> =>
  fetcher('/api/v1/balance/cierre/iniciar', { method: 'POST', body: JSON.stringify(body) })
