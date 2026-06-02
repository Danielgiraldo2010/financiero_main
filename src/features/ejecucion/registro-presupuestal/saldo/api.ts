// features/ejecucion/registro-presupuestal/saldo/api.ts
import { fetcher } from '@/shared/api/fetcher';
import type { SaldoRpResponse } from '../model/types';

export async function consultarSaldoRp(id: number): Promise<SaldoRpResponse> {
  return fetcher<SaldoRpResponse>(`/api/v1/ejecucion/rp/${id}/saldo`);
}
