import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sarViaticosKeys } from '../../model/queryKeys';
import {
  listarTarifasViaticos,
  consultarTarifaViatico,
  actualizarTarifaViatico,
  desactivarTarifaViatico,
} from './api';
import type { ListarTarifasParams, ActualizarTarifaPayload } from './api';

export function useTarifasViaticos(params: ListarTarifasParams = {}) {
  return useQuery({
    queryKey: sarViaticosKeys.tarifasList(params),
    queryFn:  () => listarTarifasViaticos(params),
  });
}

export function useTarifaViatico(id: number) {
  return useQuery({
    queryKey: sarViaticosKeys.tarifaDetail(id),
    queryFn:  () => consultarTarifaViatico(id),
    enabled:  id > 0,
  });
}

export function useActualizarTarifaViatico() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ActualizarTarifaPayload }) =>
      actualizarTarifaViatico(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: sarViaticosKeys.tarifas() }),
  });
}

export function useDesactivarTarifaViatico() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => desactivarTarifaViatico(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: sarViaticosKeys.tarifas() }),
  });
}
