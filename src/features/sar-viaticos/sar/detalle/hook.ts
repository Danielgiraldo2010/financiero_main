import { useQuery } from '@tanstack/react-query';
import { sarViaticosKeys } from '../../model/queryKeys';
import { consultarSar } from './api';

export function useSarDetalle(id: number) {
  return useQuery({
    queryKey: sarViaticosKeys.sarDetail(id),
    queryFn:  () => consultarSar(id),
    enabled:  id > 0,
  });
}
