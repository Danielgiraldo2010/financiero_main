// features/ejecucion/cdp/generar/api.ts
import { fetcher } from '@/shared/api/fetcher';
import type { CdpResponse, GenerarCdpCommand } from '../model/types';

export async function generarCdp(command: GenerarCdpCommand): Promise<CdpResponse> {
  return fetcher<CdpResponse>('/api/v1/ejecucion/cdp', {
    method: 'POST',
    body: JSON.stringify(command),
  });
}
