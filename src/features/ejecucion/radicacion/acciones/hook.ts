// features/ejecucion/radicacion/acciones/hook.ts
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import type { RechazarRadicacionCommand } from '../model/types';
import { aprobarRadicacion, rechazarRadicacion } from './api';
import { radicacionKeys } from '../model/queryKeys';

export function useAprobarRadicacion(): UseMutationResult<void, Error, number> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: aprobarRadicacion,
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: radicacionKeys.lists() });
      qc.invalidateQueries({ queryKey: radicacionKeys.detail(id) });
    },
  });
}

export function useRechazarRadicacion(): UseMutationResult<void, Error, RechazarRadicacionCommand> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: rechazarRadicacion,
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: radicacionKeys.lists() });
      qc.invalidateQueries({ queryKey: radicacionKeys.detail(v.id) });
    },
  });
}
