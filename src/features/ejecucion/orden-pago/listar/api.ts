// features/ejecucion/orden-pago/listar/api.ts
import { fetcher } from '@/shared/api/fetcher';
import type { PagedResult } from '@/shared/api/types';
import type { OrdenPagoResponse } from '../model/types';

export interface ListarOpParams {
  vigencia?: number;
  estado?: string;
  registroPresupuestalId?: number;
  pagina?: number;
  tamanoPagina?: number;
}

export async function listarOp(
  params: ListarOpParams,
): Promise<PagedResult<OrdenPagoResponse>> {
  const sp = new URLSearchParams();
  if (params.vigencia)              sp.set('vigencia',              String(params.vigencia));
  if (params.estado)                sp.set('estado',                params.estado);
  if (params.registroPresupuestalId) sp.set('registroPresupuestalId', String(params.registroPresupuestalId));
  sp.set('pagina',      String(params.pagina      ?? 1));
  sp.set('tamanoPagina', String(params.tamanoPagina ?? 20));

  return fetcher<PagedResult<OrdenPagoResponse>>(`/api/v1/ejecucion/op?${sp.toString()}`);
}
