// features/ejecucion/cdp/detalle/hook.ts
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { cdpKeys } from '../model/queryKeys';
import { consultarCdp } from './api';
import type { CdpResponse } from '../model/types';

export function useCdp(id: number): UseQueryResult<CdpResponse> {
  return useQuery({
    queryKey: cdpKeys.detail(id),
    queryFn:  () => consultarCdp(id),
    enabled:  id > 0,
  });
}
