// features/ejecucion/reservas/registrar/api.ts
import { fetcher } from '@/shared/api/fetcher';
import type { ReservaPresupuestalResponse, RegistrarReservaCommand } from '../model/types';

export async function registrarReserva(
  command: RegistrarReservaCommand,
): Promise<ReservaPresupuestalResponse> {
  return fetcher<ReservaPresupuestalResponse>('/api/v1/ejecucion/reservas', {
    method: 'POST',
    body: JSON.stringify(command),
  });
}
