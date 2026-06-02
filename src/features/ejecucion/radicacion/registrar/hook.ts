// features/ejecucion/radicacion/registrar/hook.ts
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import type { RadicacionCuentaResponse, RegistrarRadicacionCommand } from '../model/types';
import { registrarRadicacion } from './api';
import { radicacionKeys } from '../model/queryKeys';

export function useRegistrarRadicacion(): UseMutationResult<
  RadicacionCuentaResponse, Error, RegistrarRadicacionCommand
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: registrarRadicacion,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: radicacionKeys.lists() });
    },
  });
}
