// features/presupuesto/etapas/completar/hook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { presupuestoKeys } from '../../model/queryKeys';
import { completarEtapa } from './api';
import type { CompletarEtapaCommand } from '../../model/types';

export function useCompletarEtapa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (command: CompletarEtapaCommand) => completarEtapa(command),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: presupuestoKeys.etapas.all(),
      });
    },
  });
}
