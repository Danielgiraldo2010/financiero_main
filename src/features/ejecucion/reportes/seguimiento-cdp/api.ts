// features/ejecucion/reportes/seguimiento-cdp/api.ts
//
// CORRECCIÓN vs plan: el endpoint devuelve PagedResultOfCdpResponse,
// el mismo tipo CdpResponse de fe_09a — no hay tipo SeguimientoCdpRow propio.
import { fetcher } from '@/shared/api/fetcher';
import type { PagedResult } from '@/shared/api/types';
import type { CdpResponse } from '../../model/types';
import type { ReporteSeguimientoCdpParams } from '../model/types';

export async function reporteSeguimientoCdp(
  params: ReporteSeguimientoCdpParams,
): Promise<PagedResult<CdpResponse>> {
  const sp = new URLSearchParams();
  sp.set('vigencia', String(params.vigencia));
  if (params.estado)       sp.set('estado',       params.estado);
  sp.set('pagina',       String(params.pagina      ?? 1));
  sp.set('tamanoPagina', String(params.tamanoPagina ?? 20));

  return fetcher<PagedResult<CdpResponse>>(
    `/api/v1/ejecucion/reportes/cdp?${sp.toString()}`,
  );
}
