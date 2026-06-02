// features/ejecucion/registro-presupuestal/generar/api.ts
import { fetcher } from '@/shared/api/fetcher';
import type { RegistroPresupuestalResponse, GenerarRpCommand } from '../model/types';

export async function generarRp(
  command: GenerarRpCommand,
): Promise<RegistroPresupuestalResponse> {
  return fetcher<RegistroPresupuestalResponse>('/api/v1/ejecucion/rp', {
    method: 'POST',
    body: JSON.stringify(command),
  });
}
