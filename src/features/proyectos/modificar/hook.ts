import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { proyectosKeys } from '../model/queryKeys'
import { modificarProyecto } from './api'
import type { ModificarProyectoPayload } from '../model/types'

export function useModificarProyecto(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: ModificarProyectoPayload) => modificarProyecto(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: proyectosKeys.detail(id) })
      qc.invalidateQueries({ queryKey: proyectosKeys.lists() })
      toast.success('Proyecto actualizado correctamente')
    },
  })
}
