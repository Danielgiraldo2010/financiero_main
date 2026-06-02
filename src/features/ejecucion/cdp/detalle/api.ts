// features/ejecucion/cdp/detalle/api.ts
import { fetcher } from '@/shared/api/fetcher';
import type { CdpResponse } from '../model/types';

export async function consultarCdp(id: number): Promise<CdpResponse> {
  return fetcher<CdpResponse>(`/api/v1/ejecucion/cdp/${id}`);
}
