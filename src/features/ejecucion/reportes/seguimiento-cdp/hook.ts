// features/ejecucion/reportes/seguimiento-cdp/hook.ts
// INVARIANTE 09c-I1: solo lectura — useQuery, nunca useMutation.
// CORRECCIÓN: devuelve PagedResult<CdpResponse>, no SeguimientoCdpRow[].
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { PagedResult } from '@/shared/api/types';
import type { CdpResponse } from '../../model/types';
import type { ReporteSeguimientoCdpParams } from '../model/types';
import { reporteSeguimientoCdp } from './api';
import { ejecucionKeys } from '../../model/queryKeys';

const seguimientoCdpKeys = {
  all:  ()           => [...ejecucionKeys.all, 'reportes', 'seguimiento-cdp'] as const,
  list: (p: object)  => [...seguimientoCdpKeys.all(), p]                      as const,
};

export function useSeguimientoCdp(
  params: ReporteSeguimientoCdpParams,
): UseQueryResult<PagedResult<CdpResponse>> {
  return useQuery({
    queryKey: seguimientoCdpKeys.list(params),
    queryFn:  () => reporteSeguimientoCdp(params),
    enabled:  params.vigencia > 0,
  });
}
