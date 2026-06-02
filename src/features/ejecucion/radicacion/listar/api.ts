// features/ejecucion/radicacion/listar/api.ts
import { fetcher } from '@/shared/api/fetcher';
import type { PagedResult } from '@/shared/api/types';
import type { RadicacionCuentaResponse } from '../model/types';

export interface ListarRadicacionParams {
  vigencia?: number;
  estado?: string;
  pagina?: number;
  tamanoPagina?: number;
}

export async function listarRadicacion(
  params: ListarRadicacionParams,
): Promise<PagedResult<RadicacionCuentaResponse>> {
  const sp = new URLSearchParams();
  if (params.vigencia)     sp.set('vigencia',     String(params.vigencia));
  if (params.estado)       sp.set('estado',       params.estado);
  sp.set('pagina',      String(params.pagina      ?? 1));
  sp.set('tamanoPagina', String(params.tamanoPagina ?? 20));

  return fetcher<PagedResult<RadicacionCuentaResponse>>(
    `/api/v1/ejecucion/radicacion?${sp.toString()}`,
  );
}
