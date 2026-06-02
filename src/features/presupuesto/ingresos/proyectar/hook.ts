// features/presupuesto/ingresos/proyectar/hook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { presupuestoKeys } from '../../model/queryKeys';
import { proyectarIngresos } from './api';
import type { ProyectarIngresosCommand } from './api';

export function useProyectarIngresos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (command: ProyectarIngresosCommand) =>
      proyectarIngresos(command),
    onSuccess: () => {
      // Invalida ingresos y resumen porque la proyección afecta ambos
      void queryClient.invalidateQueries({
        queryKey: presupuestoKeys.ingresos.all(),
      });
      void queryClient.invalidateQueries({
        queryKey: presupuestoKeys.resumen.all(),
      });
    },
  });
}
