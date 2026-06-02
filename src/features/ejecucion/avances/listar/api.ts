// features/ejecucion/avances/listar/api.ts
import { fetcher } from '@/shared/api/fetcher';
import type { PagedResult } from '@/shared/api/types';
import type { AvanceLegalizacionResponse } from '../model/types';

export interface ListarAvancesParams {
  vigencia?: number;
  estado?: string;
  pagina?: number;
  tamanoPagina?: number;
}

export async function listarAvances(
  params: ListarAvancesParams,
): Promise<PagedResult<AvanceLegalizacionResponse>> {
  const sp = new URLSearchParams();
  if (params.vigencia) sp.set('vigencia', String(params.vigencia));
  if (params.estado)   sp.set('estado',   params.estado);
  sp.set('pagina',       String(params.pagina      ?? 1));
  sp.set('tamanoPagina', String(params.tamanoPagina ?? 20));

  return fetcher<PagedResult<AvanceLegalizacionResponse>>(
    `/api/v1/ejecucion/avances?${sp.toString()}`,
  );
}
