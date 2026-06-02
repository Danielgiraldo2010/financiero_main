import { fetcher } from '@/shared/api/fetcher';
import type { CalculoViatico } from '../../model/types';

export interface CalcularViaticoParams {
  tipoPersonal:        string;
  municipioDestinoId:  number;
  incluyePernoctacion: boolean;
  diasViaje:           number;
  horasEfectivasDict?: number | null;
  vigencia:            number;
}

export function calcularViatico(params: CalcularViaticoParams): Promise<CalculoViatico> {
  return fetcher('/api/v1/viaticos/tarifas/calcular', {
    method: 'POST',
    body:   JSON.stringify(params),
  });
}
