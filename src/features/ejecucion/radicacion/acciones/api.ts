// features/ejecucion/radicacion/acciones/api.ts
import { fetcher } from '@/shared/api/fetcher';
import type { RechazarRadicacionCommand } from '../model/types';

export async function aprobarRadicacion(id: number): Promise<void> {
  await fetcher<void>(`/api/v1/ejecucion/radicacion/${id}/aprobar`, {
    method: 'POST',
    body: JSON.stringify({ id }),
  });
}

export async function rechazarRadicacion(command: RechazarRadicacionCommand): Promise<void> {
  await fetcher<void>(`/api/v1/ejecucion/radicacion/${command.id}/rechazar`, {
    method: 'POST',
    body: JSON.stringify(command),
  });
}
