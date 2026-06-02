// features/presupuesto/gastos/proyectar/api.ts
// POST /api/v1/presupuesto/gastos/proyectar
// Invoca sp_ProyectarGastosDesdeVigenciaAnterior
import { fetcher } from '@/shared/api/fetcher';

export interface ProyectarGastosCommand {
  vigencia: number;
}

export async function proyectarGastos(
  command: ProyectarGastosCommand,
): Promise<void> {
  await fetcher<void>('/api/v1/presupuesto/gastos/proyectar', {
    method: 'POST',
    body: JSON.stringify(command),
  });
}
