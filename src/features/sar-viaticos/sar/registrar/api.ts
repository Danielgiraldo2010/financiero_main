import { fetcher } from '@/shared/api/fetcher';
import type { Sar } from '../../model/types';
import type { RegistrarSarFormValues } from '../../model/schema';

export function registrarSar(payload: RegistrarSarFormValues): Promise<Sar> {
  return fetcher('/api/v1/sar', {
    method: 'POST',
    body:   JSON.stringify(payload),
  });
}
