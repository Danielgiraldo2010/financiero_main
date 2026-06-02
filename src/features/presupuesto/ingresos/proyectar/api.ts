// features/presupuesto/ingresos/proyectar/api.ts
// POST /api/v1/presupuesto/ingresos/proyectar
// Invoca sp_ProyectarIngresosPorEstudiantes en el backend
// Solo disponible cuando el presupuesto está en estado BORRADOR
import { fetcher } from '@/shared/api/fetcher';

export interface ProyectarIngresosCommand {
  vigencia: number;
}

export async function proyectarIngresos(
  command: ProyectarIngresosCommand,
): Promise<void> {
  await fetcher<void>('/api/v1/presupuesto/ingresos/proyectar', {
    method: 'POST',
    body: JSON.stringify(command),
  });
}
