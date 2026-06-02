// features/ejecucion/cdp/listar/api.ts
import { fetcher } from '@/shared/api/fetcher';
import type { PagedResult } from '@/shared/api/types';
import type { CdpResponse } from '../model/types';

export interface ListarCdpParams {
  vigencia?: number;
  estado?: string;
  pagina?: number;
  tamanoPagina?: number;
}

export async function listarCdp(
  params: ListarCdpParams,
): Promise<PagedResult<CdpResponse>> {
  const sp = new URLSearchParams();
  if (params.vigencia) sp.set('vigencia', String(params.vigencia));
  if (params.estado)   sp.set('estado',   params.estado);
  sp.set('pagina',      String(params.pagina      ?? 1));
  sp.set('tamanoPagina', String(params.tamanoPagina ?? 20));

  return fetcher<PagedResult<CdpResponse>>(
    `/api/v1/ejecucion/cdp?${sp.toString()}`,
  );
}
