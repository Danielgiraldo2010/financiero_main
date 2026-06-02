// features/ejecucion/radicacion/registrar/api.ts
import { fetcher } from '@/shared/api/fetcher';
import type { RadicacionCuentaResponse, RegistrarRadicacionCommand } from '../model/types';

export async function registrarRadicacion(
  command: RegistrarRadicacionCommand,
): Promise<RadicacionCuentaResponse> {
  return fetcher<RadicacionCuentaResponse>('/api/v1/ejecucion/radicacion', {
    method: 'POST',
    body: JSON.stringify(command),
  });
}
