import { createFileRoute } from '@tanstack/react-router'
import { SarDetailPage } from '@/features/sar-viaticos'

export const Route = createFileRoute('/_authenticated/sar-viaticos/sar/$id')({
  staticData: { breadcrumb: 'Detalle SAR' },
  component: SarDetailPage,
})