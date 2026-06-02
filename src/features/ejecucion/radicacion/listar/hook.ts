// features/ejecucion/radicacion/listar/hook.ts
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { PagedResult } from '@/shared/api/types';
import { radicacionKeys } from '../model/queryKeys';
import { listarRadicacion, type ListarRadicacionParams } from './api';
import type { RadicacionCuentaResponse } from '../model/types';

export function useRadicaciones(
  params: ListarRadicacionParams = {},
): UseQueryResult<PagedResult<RadicacionCuentaResponse>> {
  return useQuery({
    queryKey: radicacionKeys.list(params),
    queryFn:  () => listarRadicacion(params),
  });
}
