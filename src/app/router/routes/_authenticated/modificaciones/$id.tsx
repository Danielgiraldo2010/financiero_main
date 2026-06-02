import { createFileRoute } from '@tanstack/react-router'
import { queryClient } from '@/shared/api/queryClient'
import { fetchModificacion } from '@/features/modificaciones/detalle/api'
import { modificacionesKeys }    from '@/features/modificaciones/model/queryKeys'
import { ModificacionDetailPage } from '@/features/modificaciones/detalle/ui/ModificacionDetailPage'

export const Route = createFileRoute('/_authenticated/modificaciones/$id')({
  loader: async ({ params }) => {
    const id = Number(params.id)
    await queryClient.ensureQueryData({
      queryKey: modificacionesKeys.detail(id),
      queryFn:  () => fetchModificacion(id),
    })
  },
  component: ModificacionDetailPage,
})
