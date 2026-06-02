// src/features/proyectos/anular/hook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { proyectosKeys } from '../model/queryKeys'
import { anularProyecto } from './api'

export function useAnularProyecto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, motivo }: { id: number; motivo: string }) =>
      anularProyecto(id, { motivo }),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: proyectosKeys.detail(id) })
      qc.invalidateQueries({ queryKey: proyectosKeys.lists() })
      toast.success('Proyecto anulado correctamente')
    },
  })
}