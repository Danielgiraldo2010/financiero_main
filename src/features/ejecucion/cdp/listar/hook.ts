// features/ejecucion/cdp/listar/hook.ts
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { PagedResult } from '@/shared/api/types';
import { cdpKeys } from '../model/queryKeys';
import { listarCdp, type ListarCdpParams } from './api';
import type { CdpResponse } from '../model/types';

const CDP_DEFAULTS: Required<Pick<ListarCdpParams, 'pagina' | 'tamanoPagina'>> = {
  pagina: 1,
  tamanoPagina: 20,
};

export function useCdps(
  params: ListarCdpParams = {},
): UseQueryResult<PagedResult<CdpResponse>> {
  return useQuery({
    queryKey: cdpKeys.list(params),
    queryFn:  () => listarCdp({ ...CDP_DEFAULTS, ...params }),
  });
}
