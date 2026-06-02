// features/ejecucion/orden-pago/registrar/api.ts
import { fetcher } from '@/shared/api/fetcher';
import type { OrdenPagoResponse, RegistrarOpCommand } from '../model/types';

export async function registrarOp(command: RegistrarOpCommand): Promise<OrdenPagoResponse> {
  return fetcher<OrdenPagoResponse>('/api/v1/ejecucion/op', {
    method: 'POST',
    body: JSON.stringify(command),
  });
}
