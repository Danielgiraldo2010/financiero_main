// features/ejecucion/reportes/por-rubro/hook.ts
// INVARIANTE 09c-I1: solo lectura.
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { PagedResult } from '@/shared/api/types';
import type { EjecucionMensualRow, ReporteEjecucionPorRubroParams } from '../model/types';
import { reporteEjecucionPorRubro } from './api';
import { ejecucionKeys } from '../../model/queryKeys';

const ejecucionRubroKeys = {
  all:  ()           => [...ejecucionKeys.all, 'reportes', 'por-rubro'] as const,
  list: (p: object)  => [...ejecucionRubroKeys.all(), p]                as const,
};

export function useEjecucionPorRubro(
  params: ReporteEjecucionPorRubroParams,
): UseQueryResult<PagedResult<EjecucionMensualRow>> {
  return useQuery({
    queryKey: ejecucionRubroKeys.list(params),
    queryFn:  () => reporteEjecucionPorRubro(params),
    enabled:  params.vigencia > 0,
  });
}
