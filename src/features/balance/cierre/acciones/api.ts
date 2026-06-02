import { fetcher } from '@/shared/api/fetcher'
import type { AprobarCierreCommand, CerrarDefinitivoCommand } from '../../model/types'

export const aprobarCierre = ({ id, ...body }: AprobarCierreCommand): Promise<void> =>
  fetcher(`/api/v1/balance/cierre/${id}/aprobar`, { method: 'POST', body: JSON.stringify(body) })

export const cerrarDefinitivo = ({ id, ...body }: CerrarDefinitivoCommand): Promise<void> =>
  fetcher(`/api/v1/balance/cierre/${id}/cerrar`, { method: 'POST', body: JSON.stringify(body) })
