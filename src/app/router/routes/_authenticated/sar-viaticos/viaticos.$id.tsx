import { createFileRoute } from '@tanstack/react-router'
import { ViaticoDetailPage } from '@/features/sar-viaticos'

export const Route = createFileRoute('/_authenticated/sar-viaticos/viaticos/$id')({
  staticData: { breadcrumb: 'Detalle Viático' },
  component: ViaticoDetailPage,
})