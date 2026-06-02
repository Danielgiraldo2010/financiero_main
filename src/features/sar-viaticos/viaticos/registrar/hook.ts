import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sarViaticosKeys } from '../../model/queryKeys';
import { registrarViatico } from './api';

export function useRegistrarViatico() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: registrarViatico,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: sarViaticosKeys.viaticos() });
      void qc.invalidateQueries({ queryKey: sarViaticosKeys.resumen() });
    },
  });
}
