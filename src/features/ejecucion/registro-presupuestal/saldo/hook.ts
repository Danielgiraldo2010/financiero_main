// features/ejecucion/registro-presupuestal/saldo/hook.ts
// Usado por RegistrarOpDialog (fe_09b) al seleccionar un RP.
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { rpKeys } from '../model/queryKeys';
import { consultarSaldoRp } from './api';
import type { SaldoRpResponse } from '../model/types';

export function useRpSaldo(id: number): UseQueryResult<SaldoRpResponse> {
  return useQuery({
    queryKey: rpKeys.saldo(id),
    queryFn:  () => consultarSaldoRp(id),
    enabled:  id > 0,
  });
}
