// features/ejecucion/registro-presupuestal/detalle/hook.ts
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { rpKeys } from '../model/queryKeys';
import { consultarRp } from './api';
import type { RegistroPresupuestalResponse } from '../model/types';

export function useRp(id: number): UseQueryResult<RegistroPresupuestalResponse> {
  return useQuery({
    queryKey: rpKeys.detail(id),
    queryFn:  () => consultarRp(id),
    enabled:  id > 0,
  });
}
