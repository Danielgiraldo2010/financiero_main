import { fetcher } from '@/shared/api/fetcher';
import type { ViaticoSolicitud } from '../../model/types';
import type { RegistrarViaticoFormValues } from '../../model/schema';

export function registrarViatico(payload: RegistrarViaticoFormValues): Promise<ViaticoSolicitud> {
  return fetcher('/api/v1/viaticos/solicitudes', {
    method: 'POST',
    body:   JSON.stringify({
      ...payload,
      horasEfectivasDict: payload.horasEfectivasDict ?? null,
      observaciones:      payload.observaciones      ?? null,
    }),
  });
}
