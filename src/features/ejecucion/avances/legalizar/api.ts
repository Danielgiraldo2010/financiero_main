// features/ejecucion/avances/legalizar/api.ts
// INVARIANTE 09b-I4: LegalizarAvanceCommand requiere valorLegalizado +
// urlDocumentoLegalizacion + observaciones (schema real OpenAPI).
import { fetcher } from '@/shared/api/fetcher';
import type { LegalizarAvanceCommand } from '../model/types';

export async function legalizarAvance(command: LegalizarAvanceCommand): Promise<void> {
  await fetcher<void>(`/api/v1/ejecucion/avances/${command.id}/legalizar`, {
    method: 'POST',
    body: JSON.stringify(command),
  });
}
