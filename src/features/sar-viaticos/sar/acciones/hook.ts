import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sarViaticosKeys } from '../../model/queryKeys';
import { aprobarSarDecano, anularSar, generarCdpSar, ejecutarSar } from './api';

function invalidateSar(qc: ReturnType<typeof useQueryClient>, id: number) {
  void qc.invalidateQueries({ queryKey: sarViaticosKeys.sarDetail(id) });
  void qc.invalidateQueries({ queryKey: sarViaticosKeys.sar() });
  void qc.invalidateQueries({ queryKey: sarViaticosKeys.resumen() });
}

export function useAprobarSar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Parameters<typeof aprobarSarDecano>[1] }) =>
      aprobarSarDecano(id, payload),
    onSuccess: (_, { id }) => invalidateSar(qc, id),
  });
}

export function useAnularSar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Parameters<typeof anularSar>[1] }) =>
      anularSar(id, payload),
    onSuccess: (_, { id }) => invalidateSar(qc, id),
  });
}

export function useGenerarCdpSar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Parameters<typeof generarCdpSar>[1] }) =>
      generarCdpSar(id, payload),
    onSuccess: (_, { id }) => invalidateSar(qc, id),
  });
}

export function useEjecutarSar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Parameters<typeof ejecutarSar>[1] }) =>
      ejecutarSar(id, payload),
    onSuccess: (_, { id }) => invalidateSar(qc, id),
  });
}
