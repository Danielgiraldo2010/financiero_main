// features/ejecucion/registro-presupuestal/detalle/api.ts
import { fetcher } from '@/shared/api/fetcher';
import type { RegistroPresupuestalResponse } from '../model/types';

export async function consultarRp(id: number): Promise<RegistroPresupuestalResponse> {
  return fetcher<RegistroPresupuestalResponse>(`/api/v1/ejecucion/rp/${id}`);
}
