// features/ejecucion/reportes/generar-alertas/api.ts
//
// CORRECCIÓN vs plan: el endpoint devuelve PagedResultOfAlertaResponse (no void).
// Command: { vigencia: number }
import { fetcher } from '@/shared/api/fetcher';
import type { PagedResult } from '@/shared/api/types';
import type { AlertaResponse, GenerarAlertasCommand } from '../model/types';

export async function generarAlertas(
  command: GenerarAlertasCommand,
): Promise<PagedResult<AlertaResponse>> {
  return fetcher<PagedResult<AlertaResponse>>(
    '/api/v1/ejecucion/reportes/generar-alertas',
    {
      method: 'POST',
      body: JSON.stringify(command),
    },
  );
}
