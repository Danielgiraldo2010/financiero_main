import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sarViaticosKeys } from '../../model/queryKeys';
import { registrarSar } from './api';

export function useRegistrarSar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: registrarSar,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: sarViaticosKeys.sar() });
      void qc.invalidateQueries({ queryKey: sarViaticosKeys.resumen() });
    },
  });
}
