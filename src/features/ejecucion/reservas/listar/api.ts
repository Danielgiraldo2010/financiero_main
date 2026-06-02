// features/ejecucion/reservas/listar/api.ts
import { fetcher } from '@/shared/api/fetcher';
import type { PagedResult } from '@/shared/api/types';
import type { ReservaPresupuestalResponse } from '../model/types';

export interface ListarReservasParams {
  vigenciaOrigen?: number;
  estado?: string;
  pagina?: number;
  tamanoPagina?: number;
}

export async function listarReservas(
  params: ListarReservasParams,
): Promise<PagedResult<ReservaPresupuestalResponse>> {
  const sp = new URLSearchParams();
  if (params.vigenciaOrigen) sp.set('vigenciaOrigen', String(params.vigenciaOrigen));
  if (params.estado)         sp.set('estado',         params.estado);
  sp.set('pagina',      String(params.pagina      ?? 1));
  sp.set('tamanoPagina', String(params.tamanoPagina ?? 20));

  return fetcher<PagedResult<ReservaPresupuestalResponse>>(
    `/api/v1/ejecucion/reservas?${sp.toString()}`,
  );
}
