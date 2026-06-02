import { fetcher } from '@/shared/api/fetcher';
import type { Sar } from '../../model/types';

export function consultarSar(id: number): Promise<Sar> {
  return fetcher(`/api/v1/sar/${id}`);
}
