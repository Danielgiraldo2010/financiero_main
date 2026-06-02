// features/ejecucion/cdp/verificar/api.ts
import { fetcher } from '@/shared/api/fetcher';
import type { VerificarDisponibilidadCommand, DisponibilidadResponse } from '../model/types';

export async function verificarDisponibilidad(
  command: VerificarDisponibilidadCommand,
): Promise<DisponibilidadResponse> {
  return fetcher<DisponibilidadResponse>('/api/v1/ejecucion/cdp/verificar', {
    method: 'POST',
    body: JSON.stringify(command),
  });
}
