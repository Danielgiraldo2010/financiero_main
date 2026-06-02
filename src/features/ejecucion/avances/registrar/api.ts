// features/ejecucion/avances/registrar/api.ts
import { fetcher } from '@/shared/api/fetcher';
import type { AvanceLegalizacionResponse, RegistrarAvanceCommand } from '../model/types';

export async function registrarAvance(
  command: RegistrarAvanceCommand,
): Promise<AvanceLegalizacionResponse> {
  return fetcher<AvanceLegalizacionResponse>('/api/v1/ejecucion/avances', {
    method: 'POST',
    body: JSON.stringify(command),
  });
}
