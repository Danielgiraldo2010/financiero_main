import { fetcher } from '@/shared/api/fetcher';
import type { TarifaViatico } from '../../model/types';
import type { RegistrarTarifaViaticoFormValues } from '../../model/schema';

export function registrarTarifaViatico(
  payload: RegistrarTarifaViaticoFormValues,
): Promise<TarifaViatico> {
  return fetcher('/api/v1/viaticos/tarifas', {
    method: 'POST',
    body:   JSON.stringify({
      ...payload,
      horasMinimasDict: payload.horasMinimasDict ?? null,
      vigenteHasta:     payload.vigenteHasta     ?? null,
    }),
  });
}
