// features/ejecucion/orden-pago/listar/hook.ts
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { PagedResult } from '@/shared/api/types';
import { opKeys } from '../model/queryKeys';
import { listarOp, type ListarOpParams } from './api';
import type { OrdenPagoResponse } from '../model/types';

export function useOps(
  params: ListarOpParams = {},
): UseQueryResult<PagedResult<OrdenPagoResponse>> {
  return useQuery({
    queryKey: opKeys.list(params),
    queryFn:  () => listarOp(params),
  });
}
