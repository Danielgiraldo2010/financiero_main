import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { queryClient } from '@/shared/api/queryClient'
import { fetchModificaciones } from '@/features/modificaciones/listar/api'
import { modificacionesKeys }  from '@/features/modificaciones/model/queryKeys'
import { ModificacionesPage }  from '@/features/modificaciones/listar/ui/ModificacionesPage'

const searchSchema = z.object({
  vigencia: z.number().optional(),
  estado:   z.string().optional(),
  pagina:   z.number().optional(),
})

export const Route = createFileRoute('/_authenticated/modificaciones/')({
  validateSearch: searchSchema,
  loader: async () => {
    await queryClient.ensureQueryData({
      queryKey: modificacionesKeys.list({ pagina: 1, tamanoPagina: 15 }),
      queryFn:  () => fetchModificaciones({ pagina: 1, tamanoPagina: 15 }),
    })
  },
  component: ModificacionesPage,
})
