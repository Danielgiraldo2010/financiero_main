// features/ejecucion/registro-presupuestal/listar/api.ts
import { fetcher } from '@/shared/api/fetcher';
import type { PagedResult } from '@/shared/api/types';
import type { RegistroPresupuestalResponse } from '../model/types';

export interface ListarRpParams {
  vigencia?: number;
  estado?: string;
  cdpId?: number;
  pagina?: number;
  tamanoPagina?: number;
}

export async function listarRp(
  params: ListarRpParams,
): Promise<PagedResult<RegistroPresupuestalResponse>> {
  const sp = new URLSearchParams();
  if (params.vigencia) sp.set('vigencia', String(params.vigencia));
  if (params.estado)   sp.set('estado',   params.estado);
  if (params.cdpId)    sp.set('cdpId',    String(params.cdpId));
  sp.set('pagina',      String(params.pagina      ?? 1));
  sp.set('tamanoPagina', String(params.tamanoPagina ?? 20));

  return fetcher<PagedResult<RegistroPresupuestalResponse>>(
    `/api/v1/ejecucion/rp?${sp.toString()}`,
  );
}
