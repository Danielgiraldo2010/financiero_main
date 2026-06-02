import { useQuery } from '@tanstack/react-query';
import { sarViaticosKeys } from '../../model/queryKeys';
import { consultarViatico } from './api';

export function useViaticoDetalle(id: number) {
  return useQuery({
    queryKey: sarViaticosKeys.viaticosDetail(id),
    queryFn:  () => consultarViatico(id),
    enabled:  id > 0,
  });
}
