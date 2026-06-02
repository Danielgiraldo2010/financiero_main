import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sarViaticosKeys } from '../../model/queryKeys';
import { listarViaticos, actualizarViatico } from './api';
import type { ListarViaticosParams, ActualizarViaticoPayload } from './api';

export function useViaticos(params: ListarViaticosParams = {}) {
  return useQuery({
    queryKey: sarViaticosKeys.viaticosList(params),
    queryFn:  () => listarViaticos(params),
  });
}

export function useActualizarViatico() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ActualizarViaticoPayload }) =>
      actualizarViatico(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: sarViaticosKeys.viaticos() }),
  });
}
