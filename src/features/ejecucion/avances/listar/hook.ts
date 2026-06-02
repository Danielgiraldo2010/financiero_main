// features/ejecucion/avances/listar/hook.ts
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { PagedResult } from '@/shared/api/types';
import { avanceKeys } from '../model/queryKeys';
import { listarAvances, type ListarAvancesParams } from './api';
import type { AvanceLegalizacionResponse } from '../model/types';

export function useAvances(
  params: ListarAvancesParams = {},
): UseQueryResult<PagedResult<AvanceLegalizacionResponse>> {
  return useQuery({
    queryKey: avanceKeys.list(params),
    queryFn:  () => listarAvances(params),
  });
}
