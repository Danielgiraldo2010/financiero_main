import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sarViaticosKeys } from '../../model/queryKeys';
import { aprobarViatico, anularViatico, generarCdpViatico, liquidarViatico } from './api';

function invalidateViatico(qc: ReturnType<typeof useQueryClient>, id: number) {
  void qc.invalidateQueries({ queryKey: sarViaticosKeys.viaticosDetail(id) });
  void qc.invalidateQueries({ queryKey: sarViaticosKeys.viaticos() });
  void qc.invalidateQueries({ queryKey: sarViaticosKeys.resumen() });
}

export function useAprobarViatico() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Parameters<typeof aprobarViatico>[1] }) =>
      aprobarViatico(id, payload),
    onSuccess: (_, { id }) => invalidateViatico(qc, id),
  });
}

export function useAnularViatico() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Parameters<typeof anularViatico>[1] }) =>
      anularViatico(id, payload),
    onSuccess: (_, { id }) => invalidateViatico(qc, id),
  });
}

export function useGenerarCdpViatico() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Parameters<typeof generarCdpViatico>[1] }) =>
      generarCdpViatico(id, payload),
    onSuccess: (_, { id }) => invalidateViatico(qc, id),
  });
}

export function useLiquidarViatico() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Parameters<typeof liquidarViatico>[1] }) =>
      liquidarViatico(id, payload),
    onSuccess: (_, { id }) => invalidateViatico(qc, id),
  });
}
