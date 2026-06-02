// features/ejecucion/reservas/listar/hook.ts
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { PagedResult } from '@/shared/api/types';
import { reservaKeys } from '../model/queryKeys';
import { listarReservas, type ListarReservasParams } from './api';
import type { ReservaPresupuestalResponse } from '../model/types';

export function useReservas(
  params: ListarReservasParams = {},
): UseQueryResult<PagedResult<ReservaPresupuestalResponse>> {
  return useQuery({
    queryKey: reservaKeys.list(params),
    queryFn:  () => listarReservas(params),
  });
}
