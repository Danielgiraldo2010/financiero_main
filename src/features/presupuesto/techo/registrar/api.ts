// features/presupuesto/techo/registrar/api.ts
// POST /api/v1/presupuesto/techo
// Solo disponible para SUPERADMIN / ADMIN_CENTRAL
import { fetcher } from '@/shared/api/fetcher';
import type { RegistrarTechoCommand, TechoPresupuestalResponse } from '../../model/types';

export async function registrarTecho(
  command: RegistrarTechoCommand,
): Promise<TechoPresupuestalResponse> {
  return fetcher<TechoPresupuestalResponse>('/api/v1/presupuesto/techo', {
    method: 'POST',
    body: JSON.stringify(command),
  });
}
