import { useMutation } from '@tanstack/react-query';
import { calcularViatico } from './api';

export function useCalcularViatico() {
  return useMutation({ mutationFn: calcularViatico });
}
