import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sarViaticosKeys } from '../../model/queryKeys';
import { listarSar, actualizarSar } from './api';
import type { ListarSarParams, ActualizarSarPayload } from './api';

export function useSar(params: ListarSarParams = {}) {
  return useQuery({
    queryKey: sarViaticosKeys.sarList(params),
    queryFn:  () => listarSar(params),
  });
}

export function useActualizarSar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ActualizarSarPayload }) =>
      actualizarSar(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: sarViaticosKeys.sar() }),
  });
}
