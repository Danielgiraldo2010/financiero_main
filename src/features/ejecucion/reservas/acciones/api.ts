// features/ejecucion/reservas/acciones/api.ts
// INVARIANTE 09b-I6: EjecutarReservaCommand requiere { id, valorEjecutar }.
import { fetcher } from '@/shared/api/fetcher';
import type { EjecutarReservaCommand, AnularReservaCommand } from '../model/types';

export async function ejecutarReserva(command: EjecutarReservaCommand): Promise<void> {
  await fetcher<void>(`/api/v1/ejecucion/reservas/${command.id}/ejecutar`, {
    method: 'POST',
    body: JSON.stringify({ id: command.id, valorEjecutar: command.valorEjecutar }),
  });
}

export async function anularReserva(command: AnularReservaCommand): Promise<void> {
  await fetcher<void>(`/api/v1/ejecucion/reservas/${command.id}/anular`, {
    method: 'POST',
    body: JSON.stringify({ id: command.id, motivo: command.motivo }),
  });
}
